Hippo::API.routes.for_extension 'sm' do
    resources SM::Event
    resources SM::Venue
    resources SM::Embed
    resources SM::Presenter
    resources SM::Event,    path: 'embed/events',   controller: SM::Handlers::Events,   cors: '*', public: true
    resources SM::Purchase, path: 'embed/purchase', controller: SM::Handlers::Purchase, cors: '*', public: true


end


class Hippo::API::Root

    post '/signup', &SM::Handlers::Signup.handler

    get '/signup' do
        erb :signup, locals: { tenant: false }
    end

    get '/terms' do
        erb :terms
    end
end

Hippo::API::Routing.root_view_route = lambda do
    Hippo::API::Root.get '/*' do
        if MultiTenant.current_tenant
            erb :app, layout: false
        else
            erb :homepage
        end
    end
end
