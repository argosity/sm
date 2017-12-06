module SM
    module Payments
        SUCCESS_MSG = 'Charged successfully'.freeze

        extend self

        def vendor_id
            (Hippo::SystemSettings.config.settings['paymentsVendor'] || 'unknown').downcase.to_sym
        end

        def vendor
            if vendor_id == :square
                return SM::Payments::Square
            elsif vendor_id == :braintree
                return SM::Payments::Braintree
            end
        end

    end
end

require_relative "payments/charge_result"
require_relative "payments/braintree"
require_relative "payments/square"
