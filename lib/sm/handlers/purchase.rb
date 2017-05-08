require 'hippo/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Purchase < Hippo::API::ControllerBase

            def show
                begin
                    gw = ::Braintree::ClientTokenGateway.new(SM::BraintreeConfig.gateway)
                    std_api_reply(:get, token: gw.generate, success: true)
                rescue Braintree::AuthenticationError, Braintree::ConfigurationError => e
                    Hippo.logger.warn e
                    std_api_reply(:get, {}, {
                                      message: 'Processor authentication failure',
                                      errors: { authentication: 'failed' } ,
                                      success: false
                                  })
                end
            end

            def create
                purchase = SM::Purchase.new(
                    data.slice('name', 'phone', 'email', 'qty')
                )
                purchase.event = SM::Event.find_by(identifier: data['event_identifier'])
                SM::Purchase.transaction do
                    data['payments'].each do |payment_data|
                        purchase.payments.build(payment_data)
                    end
                    if purchase.valid?
                        purchase.payments.each{ |payment| process_charge(purchase, payment) }
                        purchase.save
                    end
                end

                begin # we've charged the card at this point and we must show the results page
                    email_receipt(purchase) if purchase.errors.none?
                rescue => e
                    Hippo.logger.error "Failed to deliver email for purchase id #{purchase.id} : #{e}"
                end

                std_api_reply(:create, purchase, {
                                  success: !purchase.new_record?,
                                  only: [:identifier, :name, :qty, :email],
                                  methods: [:total, :tickets_url],
                                  include: {
                                      event: {
                                          only: [
                                              :identifier, :title, :sub_title,
                                              :description, :price, :occurs_at
                                          ]
                                      }
                                  }
                              })
            end

            private

            def process_charge(purchase, payment)
                sale = BraintreeConfig.sale(
                    amount: payment.amount,
                    payment_method_nonce: payment.nonce,
                    options: { submit_for_settlement: true },
                    customer: {
                        first_name: purchase.first_name,
                        last_name: purchase.last_name,
                        phone: purchase.phone,
                        email: purchase.email
                    }
                )
                Hippo.logger.warn "Processed CC transaction #{sale.transaction.id} for nonce #{payment['nonce']}, result: #{sale.success? ? 'success' : sale.message}"
                if sale.success?
                    payment.processor_transaction = sale.transaction.id
                else
                    purchase.errors.add(:payment, sale.message)
                    raise ActiveRecord::Rollback
                end
            end

            def email_receipt(purchase)
                mail = Hippo::Mailer.create
                mail.content_type = 'text/html; charset=UTF-8'
                mail.body = ::SM::Templates::Purchase.new(purchase).render
                mail.to = purchase.email
                mail.subject = "Your tickets for #{purchase.event.title}"
                mail.deliver
            end

        end

    end
end
