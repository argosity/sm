require 'hippo/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Sale < Hippo::API::ControllerBase

            def update
                sale = SM::Sale.find(params[:id])
                if data['send_receipt']
                    sale.email = data['send_receipt']
                    Hippo::Tenant.system.perform do
                        SM::Templates::Sale.create(sale).deliver
                    end
                end
                std_api_reply(:update, {}, success: true)
            end

            def show
                perform_retrieval
            end

            def create
                sale = SM::Sale.new(
                    data.slice('name', 'phone', 'email', 'qty')
                )
                sale.show_time = SM::ShowTime.preload(:show).find_by(identifier: data['time_identifier'])

                SM::Sale.transaction do
                    data['payments'].each do |payment_data|
                        sale.payments.build(payment_data)
                    end
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
                bt = BraintreeConfig.sale(
                    amount: payment.amount,
                    payment_method_nonce: payment.nonce,
                    options: { submit_for_settlement: true },
                    customer: {
                        first_name: sale.first_name,
                        last_name: sale.last_name,
                        phone: sale.phone,
                        email: sale.email
                    }
                )
                Hippo.logger.warn "Processed CC transaction #{bt.transaction.id} for nonce #{payment['nonce']}, result: #{bt.success? ? 'success' : bt.message}"
                if bt.success?
                    payment.processor_transaction = bt.transaction.id
                else
                    sale.errors.add(:payment, bt.message)
                    raise ActiveRecord::Rollback
                end
            end

            def email_receipt(sale)
                SM::Templates::Sale.create(sale).deliver
            end

        end

    end
end
