require 'hippo/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Payment < Hippo::API::ControllerBase

            def show
                begin
                    std_api_reply(
                        :get,
                        token: SM::Payments.vendor.payment_authorization,
                        success: true
                    )
                rescue => e
                    Hippo.logger.warn e
                    std_api_reply(
                        :get, {}, {
                            message: 'Processor authentication failure',
                            errors: { payment_processor_authentication: 'failed' } ,
                            success: false
                        })
                end
            end

        end
    end
end
