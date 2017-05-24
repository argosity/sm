FactoryGirl.define do
    factory :venue, class: SM::Venue do
        code { Hippo::Strings.random(10) }
        name { Faker::Name.name }
        phone_number { Faker::PhoneNumber.phone_number }
        capacity { (rand*100).to_i }
        address do
            "#{Faker::Address.street_address} #{Faker::Address.city} #{Faker::Address.state}"
        end
    end
end
