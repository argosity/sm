Hippo::API.routes.for_extension 'sm' do
    # Embed routes must come before the Embed resource, otherwise it handles the requests
    resources SM::ShowTime
    resources SM::Sale, path: 'sale/submit', controller: SM::Handlers::Checkout, cors: '*', public: true
    resources SM::Sale, controller: SM::Handlers::Sale
    resources SM::Payment, path: 'payment', controller: SM::Handlers::Payment, cors: '*', public: true
    resources SM::Show, path: 'embed/shows', controller: SM::Handlers::Shows, cors: '*', public: true
    resources SM::Show
    resources SM::Venue
    resources SM::Presenter
    resources SM::Embed
    resources SM::Redemption
    resources SM::Message, path: 'message/defaults', controller: SM::Handlers::MessageDefaults
    resources SM::Message
    resources SM::SquareAuth, controller: SM::Handlers::Square

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

    get '/mobile', &SM::Handlers::Mobile.handler
    post '/mobile', &SM::Handlers::Mobile.handler

    post '/sq/notice' do
        'hi'
    end

    get '/sq/auth' do
        redirect SM::Payments::Square.authorize(params, request)
    end

    get '/sq/relay-auth' do
        erb :square_oauth, locals: params, layout: false
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
