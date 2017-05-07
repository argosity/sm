FactoryGirl.define do
    factory :presenter, class: SM::Presenter do
        association :tenant, factory: :tenant, strategy: :build
        code { Lanes::Strings.random(10) }
        name { Faker::Name.name }
    end
end
