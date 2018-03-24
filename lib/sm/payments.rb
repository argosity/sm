module SM
    module Payments
        SUCCESS_MSG = 'Charged successfully'.freeze

        extend self

        def vendor_name
            Hippo::SystemSettings.config.settings['paymentsVendor'] || 'test'
        end

        def vendor_id
            vendor_name.downcase.to_sym
        end

        def vendor
            if vendor_id == :square
                return SM::Payments::Square
            elsif vendor_id == :braintree
                return SM::Payments::Braintree
            else
                return SM::Payments::MockProvider
            end
        end

    end
end

require_relative "payments/charge_result"
require_relative "payments/braintree"
require_relative "payments/square"
require_relative "payments/mock_provider"
