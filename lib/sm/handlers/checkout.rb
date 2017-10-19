require 'hippo/api/controller_base'

module SM
    module Handlers
        class Checkout < Hippo::API::ControllerBase

            def create
                sale = SM::Sale.new(
                    data.slice('name', 'phone', 'email', 'qty')
                )
                sale.show_time = SM::ShowTime
                                     .preload(:show)
                                     .find_by(
                                         identifier: data['time_identifier']
                                     )

                SM::Sale.transaction do
                    payment = data['payments'].first
                    sale.payments.build(
                        payment.merge(amount: sale.show_time.price)
                    )
                    if sale.valid?
                        sale.payments.each{ |payment| process_charge(sale, payment) }
                        sale.save
                    end
                end

                begin # we've charged the card at this point and we must show the results page
                    email_receipt(sale) if sale.errors.none?
                rescue => e
                    Hippo.logger.error "Failed to deliver email for sale id #{sale.id} : #{e}"
                end

                std_api_reply(:create, sale, {
                                  success: !sale.new_record?,
                                  only: [:identifier, :name, :qty, :email],
                                  methods: [:total, :tickets_url],
                                  include: {
                                      show: {
                                          only: [
                                              :identifier, :title, :sub_title,
                                              :description, :price, :occurs_at
                                          ]
                                      }
                                  }
                              })
            end

            private

            def process_charge(sale, payment)
                trn = SM::Payments.vendor.sale(payment)
                Hippo.logger.warn "Processed CC transaction #{trn.transaction} for nonce #{payment['nonce']}, result: #{trn.message}"
                if trn.ok?
                    payment.processor_transaction = trn.transaction
                else
                    sale.errors.add(:payment, trn.message)
                    raise ActiveRecord::Rollback
                end
            end

            def email_receipt(sale)
                SM::Templates::Sale.create(sale).deliver
            end
        end

    end
end
