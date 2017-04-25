require 'lanes/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Purchase < Lanes::API::ControllerBase

            def show
                begin
                    gw = ::Braintree::ClientTokenGateway.new(SM::BraintreeConfig.gateway)
                    std_api_reply(:get, token: gw.generate, success: true)
                rescue Braintree::AuthenticationError => e
                    Lanes.logger.warn e
                    std_api_reply(:get, {}, {
                                      message: 'Processor authentication failure',
                                      errors: { authentication: 'failed' } ,
                                      success: false
                                  })
                end
            end

            def create
                purchase = SM::Purchase.new(
                    data.slice('name', 'phone', 'email', 'qty', 'event_id')
                )
                SM::Purchase.transaction do
                    if purchase.valid?
                        apply_payments(purchase)
                        purchase.save
                    end
                end
                begin # we've charged the card at this point and we must show the results page
                    email_receipt(purchase) if purchase.errors.none?
                rescue => e
                    Lanes.logger.error "Failed to deliver email for purchase id #{purchase.id} : #{e}"
                end

                std_api_reply(:create, purchase, success: !purchase.new_record?)
            end

            private

            def apply_payments(purchase)
                data['payments'].each do |payment_data|
                    payment_data['processor_transaction'] = process_charge(purchase, payment_data)
                    purchase.payments.build(payment_data)
                end
            end

            def process_charge(purchase, payment_data)
                payment = BraintreeConfig.sale(
                    amount: purchase.event.price,
                    payment_method_nonce: payment_data['nonce'],
                    options: { submit_for_settlement: true }
                )
                Lanes.logger.warn "Processed CC transaction #{payment.transaction.id} for nonce #{payment_data['nonce']}, result: #{payment.success? ? 'success' : payment.message}"
                if payment.success?
                    return payment.transaction.id
                else
                    purchase.errors.add(:payment, payment.message)
                    raise ActiveRecord::Rollback
                end
            end

            def email_receipt(purchase)
                mail = Lanes::Mailer.create

                mail.body = Template::Purchase.new(purchase).render

                mail.to = purchase.email
                mail.subject = "Your tickets for #{purchase.event.title}"
                mail.content_type = 'text/html; charset=UTF-8'
                mail.body = email_body
                mail.deliver
            end

        end

    end
end
