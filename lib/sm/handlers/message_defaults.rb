require 'hippo/api/controller_base'
require 'axlsx'

module SM

    module Handlers
        class MessageDefaults < Hippo::API::ControllerBase

            def show
                std_api_reply( :retrieve, {
                                   order_confirmation_subject: SM::Templates::Sale.default_subject,
                                   order_confirmation_body: SM::Templates::Sale.default_body
                               })
            end

        end
    end
end
