Hippo::API.routes.for_extension 'sm' do
    # Embed routes must come before the Embed resource, otherwise it handles the requests
    resources SM::ShowTime
    resources SM::Sale, controller: SM::Handlers::Sale, cors: '*', public: true
    resources SM::Payment, controller: SM::Handlers::Payment, cors: '*', public: true
    resources SM::Show, path: 'embed/shows', controller: SM::Handlers::Shows, cors: '*', public: true
    resources SM::Show
    resources SM::Venue
    resources SM::Presenter
    resources SM::Embed
    resources SM::Redemption
    resources SM::Message, path: 'message/defaults', controller: SM::Handlers::MessageDefaults
    resources SM::Message

    get 'show-time/:id/sales-report.xlsx' do
        SM::Handlers::Shows.xls_sale_report(params[:id], headers)

    end
end


class Hippo::API::Root

    post '/signup', &SM::Handlers::Signup.handler

    get '/signup' do
        erb :signup, locals: { tenant: false }
    end

    get '/terms' do
        erb :terms
    end

    get '/sq/auth' do
        auth = SM::Payments::Square.authorize(params, request)
        erb :square_oauth, locals: auth, layout: false
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
