FactoryBot.define do
    factory :square_auth, class: SM::SquareAuth do
        tenant { Hippo::Tenant.current }

        token { Hippo::Strings.random }
        merchant_id { Hippo::Strings.random }
        expires_at { Time.now + 1.month }
        location_id '001'
        location_name 'Default Location'
    end
end
