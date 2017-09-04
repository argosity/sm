Hippo::API.routes.for_extension 'sm' do
    # Embed routes must come before the Embed resource, otherwise it handles the requests
    resources SM::ShowTime
    resources SM::Purchase, controller: SM::Handlers::Purchase, cors: '*', public: true
    resources SM::Show, path: 'embed/shows', controller: SM::Handlers::Shows, cors: '*', public: true
    resources SM::Show
    resources SM::Venue
    resources SM::Presenter
    resources SM::Embed
    resources SM::Redemption
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
            erb :hippo_root_view, layout: false
        else
            erb :homepage
        end
    end
end
