require 'hippo/api/controller_base'

module SM::Handlers
    class Tenant < Hippo::API::ControllerBase
        PUBLIC_ATTRS = %w{slug name}

        def show
            std_api_reply(:retrieve, SM::Tenant.current, only: PUBLIC_ATTRS)
        end

        # isn't really a create, but FE will think it's creating because we don't expose the id
        def create
            SM::Tenant.current.assign_attributes(data.slice(*PUBLIC_ATTRS))
            std_api_reply(:update, SM::Tenant.current, only: PUBLIC_ATTRS, success: SM::Tenant.current.save)
        end
    end
end
