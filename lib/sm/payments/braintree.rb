require 'braintree'
module SM
    module Payments
        module Braintree
            CONFIG_KEY = 'braintree'

            extend self

            def config
                cc = client_config_values
                ::Braintree::Configuration.new(
                    environment: cc['sandbox_mode'] ? :sandbox : :production,
                    merchant_id: cc['merchant_id'],
                    public_key:  cc['public_key'],
                    private_key: cc['private_key'],
                    logger:      Hippo.logger
                )
            end

            def system_settings_values
                Hippo.config.secrets['payments'][CONFIG_KEY]
            end

            def client_config_values
                Hippo::SystemSettings.config.settings[CONFIG_KEY]
            end

            def payment_authorization
                gw = ::Braintree::ClientTokenGateway.new(gateway)
                gw.generate
            end

            def gateway
                ::Braintree::Gateway.new(config)
            end

            def sale(payment)
                sale = payment.sale
                transaction_gw = ::Braintree::TransactionGateway.new(self.gateway)
                trn = transaction_gw.sale(
                    amount: payment.amount,
                    payment_method_nonce: payment.nonce,
                    options: { submit_for_settlement: true },
                    customer: {
                        first_name: sale.attendee.first_name,
                        last_name: sale.attendee.last_name,
                        phone: sale.attendee.phone,
                        email: sale.attendee.email
                    }
                )
                payment.processor_id = :braintree
                payment.processor_transaction = trn.success? ?
                                                    trn.transaction.id : ''
                ChargeResult.new(
                    success: trn.success?,
                    message: trn.success? ? Payments::SUCCESS_MSG : trn.message
                )
            end

            def refund(sale)

            end
        end
    end
end
