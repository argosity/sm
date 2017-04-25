module SM
    class TenantDomainRouter
        def initialize(app)
            @app = app
        end

        def call(env)
            domain_parts = env['SERVER_NAME'].split('.')
            if domain_parts.length == 3
                tenant = Tenant.where(slug: domain_parts.first).first
                MultiTenant.with(tenant) do
                    @app.call(env)
                end
            else
                @app.call(env)
            end
        end
    end
end
