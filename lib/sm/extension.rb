require_relative "../sm"

module SM

    class Extension < Hippo::Extensions::Definition

        identifier "sm"

        title "ShowMaker"

        root_path Pathname.new(__FILE__).dirname.join("..","..").expand_path

        # If a data structure that can be represented as JSON
        # is returned from this method, it will be passed to
        # the setBootstrapData method in client/sm/Extension.coffee
        # when the app boots
        def client_bootstrap_data
            { rollbar:  Hippo.config.secrets.dig('rollbar', 'client') }
        end

        def on_dev_console
            require 'faker'
            require 'factory_girl'
            FactoryGirl.find_definitions
            MultiTenant.current_tenant = SM::Tenant.system
        end

        def view_templates
            ['app.html', 'homepage.html', 'homepage-script-tag.html']
        end

    end

end
