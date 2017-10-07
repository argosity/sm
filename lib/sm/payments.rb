module SM
    module Payments
        SUCCESS_MSG = 'Charged successfully'

        extend self

        def vendor
            vendor = Hippo::SystemSettings.config.settings['paymentsVendor']
            if vendor == 'Square'
                return SM::Payments::Square
            elsif vendor == 'Braintree'
                return SM::Payments::Braintree
            end
        end

    end
end

require_relative "payments/charge_result"
require_relative "payments/braintree"
require_relative "payments/square"
