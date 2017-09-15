require 'hippo/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Payment < Hippo::API::ControllerBase

            def show
                begin
                    gw = ::Braintree::ClientTokenGateway.new(SM::BraintreeConfig.gateway)
                    std_api_reply(:get, token: gw.generate, success: true)
                rescue Braintree::NotFoundError,
                       Braintree::ConfigurationError,
                       Braintree::AuthenticationError => e
                    Hippo.logger.warn e
                    std_api_reply(:get, {}, {
                                      message: 'Processor authentication failure',
                                      errors: { payment_processor_authentication: 'failed' } ,
                                      success: false
                                  })
                end
            end

        end
    end
end
