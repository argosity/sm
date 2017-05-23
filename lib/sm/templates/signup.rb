module SM
    module Templates
        class Signup < Mail

            def initialize(tenant, user)
                @tenant = tenant
                @user = user
            end

            def to
                @tenant.email
            end

            def subject
                'Thanks for signing up for ShowMaker'
            end

            def variables
                {
                    'slug' => @tenant.slug,
                    'login' => @user.login,
                    'signup_url' => @tenant.url
                }
            end

        end
    end
end
