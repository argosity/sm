FactoryGirl.define do
    factory :embed, class: SM::Embed do
        name { Faker::Commerce.product_name }

    end
end
