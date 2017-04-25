FactoryGirl.define do
    factory :purchase, class: SM::Purchase do
        association :tenant, factory: :tenant, strategy: :build
        association :event, factory: :event, strategy: :build

        qty { (rand * 4).to_i + 1 }
        name { Faker::Name.name }
        payments { build_list :payment, 1 }
    end
end
