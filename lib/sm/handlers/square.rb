require 'hippo/api/controller_base'

module SM
    module Handlers
        class Square < Hippo::API::ControllerBase

            def show
                auth = SquareAuth
                           .where(tenant: Hippo::Tenant.current)
                           .first

                std_api_reply(
                    :retrieve, auth, success: true, only: [
                        :location_id, :location_name
                    ])
            end

            def update
                sqa = SquareAuth.find_or_initialize_by(
                    tenant: Hippo::Tenant.current
                )
                sqa.set_attribute_data(data, current_user)
                options = build_reply_options.merge(success: sqa.save)
                std_api_reply(:create, sqa, options)
            end

        end
    end
end
