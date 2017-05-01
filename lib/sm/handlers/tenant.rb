require 'lanes/api/controller_base'

module SM::Handlers

    class Tenant < Lanes::API::ControllerBase

        def show
            std_api_reply(:retrieve, SM::Tenant.first.as_json(only: %w{slug name}))
        end

    end

end
