FactoryGirl.define do
    factory :attendee, class: SM::Attendee do
        tenant { Hippo::Tenant.current }
        name { Faker::Name.name }
        email { Faker::Internet.email }
        phone { Faker::PhoneNumber.phone_number  }

    end
end
