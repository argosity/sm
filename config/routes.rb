Lanes::API.routes.for_extension 'sm' do
    resources SM::Event
    resources SM::Venue
    resources SM::Presenter

    resources SM::Event,    path: 'public/events',   controller: SM::Handlers::Events,   cors: '*', public: true
    resources SM::Purchase, path: 'public/purchase', controller: SM::Handlers::Purchase, cors: '*', public: true



#    resources SM::Purchase, path: 'public/purchase', controller: SM::Handlers::Purchase, cors: '*', public: true

end


class Lanes::API::Root

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


    APP = Pathname.new(__FILE__).dirname.join("..", "public", "assets", "app.html").expand_path
    HOMEPAGE = Pathname.new(__FILE__).dirname.join("..", "public", "assets", "homepage.html").expand_path

    if Lanes.env.production?
        get '/*' do
            send_file MultiTenant.current_tenant ? APP : HOMEPAGE
        end
    end

end


Lanes::API::Root.use SM::TenantDomainRouter
