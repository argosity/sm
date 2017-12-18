FactoryBot.define do
    factory :embed, class: SM::Embed do
        tenant {  Hippo::Tenant.current }
        name { Faker::Commerce.product_name }
        tenants { [tenant.slug] }
    end
end
