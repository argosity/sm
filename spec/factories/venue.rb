FactoryGirl.define do
    factory :venue, class: SM::Venue do
        association :tenant, factory: :tenant, strategy: :build

        code { Lanes::Strings.random(10) }
        name { Faker::Name.name }
        phone_number { Faker::PhoneNumber.phone_number }
        capacity { (rand*100).to_i }
        address do
            "#{Faker::Address.street_address} #{Faker::Address.city} #{Faker::Address.state}"
        end
    end
end
