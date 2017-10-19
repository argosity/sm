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
        def static_bootstrap_data
            {
                rollbar:  Hippo.config.secrets.dig('rollbar', 'client'),
                payments: {
                    square: {
                        url: SM::Payments::Square.authorization_url
                    }
                }
            }
        end

        def tenant_bootstrap_data(tenant)
            {
                payments: {
                    vendor: tenant.system_settings.settings['paymentsVendor'],
                }
            }
        end

    end

end
