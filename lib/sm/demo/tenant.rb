module SM::Demo

    module Tenant
        IDENTIFIER = 'q9JmCesvRakW'
        LOGIN = 'admin'

        def self.update

            tenant = Hippo::Tenant.find_by(identifier: IDENTIFIER) ||
                     Hippo::Tenant.build(ATTRS)
            tenant.update_attributes!(
                identifier: IDENTIFIER, slug: 'demo',
                name: 'demo', email: 'contact@argosity.com',
                subscription: Hippo::Subscription.last
            )
            user = tenant.users.find_by(login: LOGIN) || tenant.users.build
            user.update_attributes!(
                login: LOGIN,
                name: Faker::Name.name,
                email: Faker::Internet.email,
                password: 'password',
                role_names: ['administrator']
            )
            tenant
        end
    end

end
