require 'lanes/api/controller_base'

module SM

    module Handlers
        # exposes an event record to the public via a CORS enabled endpoing,
        # without authentication
        # Care is taken to only expose a few attributes of SKU's marked as "public"
        class Events < Lanes::API::ControllerBase

            def show
                std_api_reply(:retrieve, SM::Embed.json_for(params['id']))
            end

            private

            # def build_query(query = model.all)
            #     query = super
            #     query.where("visible_after <= now() and visible_until >= now()")
            # end

            # private
            # def query_scopes
            #     ['with_details']
            # end
        end
    end

end
