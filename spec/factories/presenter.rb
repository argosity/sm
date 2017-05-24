FactoryGirl.define do
    factory :presenter, class: SM::Presenter do
        code { Hippo::Strings.random(10) }
        name { Faker::Name.name }
    end
end
