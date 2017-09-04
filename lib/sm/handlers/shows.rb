require 'hippo/api/controller_base'

module SM

    module Handlers
        # exposes an show record to the public via a CORS enabled endpoing,
        # without authentication
        # Care is taken to only expose a few attributes of SKU's marked as "public"
        class Shows < Hippo::API::ControllerBase

            def show
                std_api_reply(:retrieve, SM::Embed.json_for(params['id']))
            end

        end
    end

end
