FactoryGirl.define do
    factory :venue, class: SM::Venue do
        code { Hippo::Strings.random(10) }
        name { Faker::Name.name }
        phone_number { Faker::PhoneNumber.phone_number }
        capacity { (rand*100).to_i }
        timezone { ActiveSupport::TimeZone::MAPPING.values.sample }
        online_sales_halt_mins_before  { (rand*90).to_i + 30 }
        address do
            "#{Faker::Address.street_address} #{Faker::Address.city} #{Faker::Address.state} #{Faker::Address.postcode}"
        end
    end
end
