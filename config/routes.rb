Hippo::API.routes.for_extension 'sm' do
    resources SM::Event
    resources SM::Venue
    resources SM::Embed
    resources SM::Presenter

    resources SM::Event,    path: 'embed/events',   controller: SM::Handlers::Events,   cors: '*', public: true
    resources SM::Purchase, path: 'embed/purchase', controller: SM::Handlers::Purchase, cors: '*', public: true

    resources SM::Tenant,   controller: SM::Handlers::Tenant
end


class Hippo::API::Root

    post '/signup' do
        tenant = SM::Tenant.signup(params)
        if tenant.errors.any?
            erb :signup, locals: { tenant: tenant }
        else
            MultiTenant.with(tenant) do
                erb :signup_success, locals: { tenant: tenant }
            end
        end
    end

    get '/signup' do
        erb :signup, locals: { tenant: false }
    end

    get '/terms' do
        erb :terms
    end

    Hippo::API::Routing.route_root_view = lambda do
        Hippo::API::Root.get '/*' do
            if MultiTenant.current_tenant
                erb :app, layout: false
            else
                erb :homepage
            end
        end
    end
end

Hippo::API::Root.use SM::TenantDomainRouter
