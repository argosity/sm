require 'braintree'
module SM

    module BraintreeConfig
        FAKE_LANES_EXT = 'skr-ccgateway'
        CONFIG_KEY = 'braintree'

        class << self

            def system_settings
                Lanes::SystemSettings.for_ext(FAKE_LANES_EXT)
            end

            def system_settings_values
                system_settings[CONFIG_KEY] || {}
            end

            def config
                config = system_settings_values
                Braintree::Configuration.new(
                    environment: Lanes.env.production? ? :production : :sandbox,
                    merchant_id: config['merchant_id'],
                    public_key:  config['public_key'],
                    private_key: config['private_key'],
                    logger:      Lanes.logger
                )
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
