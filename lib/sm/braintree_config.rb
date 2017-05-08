require 'braintree'
module SM

    module BraintreeConfig
        CONFIG_KEY = 'braintree'

        class << self

            def config
                config = system_settings_values
                Braintree::Configuration.new(
                    environment: Hippo.env.production? ? :production : :sandbox,
                    merchant_id: config['merchant_id'],
                    public_key:  config['public_key'],
                    private_key: config['private_key'],
                    logger:      Hippo.logger
                )
            end

            def system_settings_values
                Hippo::SystemSettings.config.for_ext(CONFIG_KEY)
            end

            def gateway
                Braintree::Gateway.new(config)
            end

            def sale(attrs)
                transaction_gw = Braintree::TransactionGateway.new(self.gateway)
                transaction_gw.sale(attrs)
            end

        end
    end
end
