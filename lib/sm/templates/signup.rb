module SM

    module Templates
        class Signup < Mail

            attr_reader :tenant

            def initialize(tenant)
                @tenant = tenant
            end

            def variables
                vars = {
                    'slug' => tenant.slug,
                    'signup_url' => tenant.url,
                    'login' => tenant.users.first.login
                }
            end

        end
    end
end
