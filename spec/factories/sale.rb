FactoryGirl.define do
    factory :sale, class: SM::Sale do
        tenant {  Hippo::Tenant.current }

        association :show_time, factory: :show_time

        qty { (rand * 4).to_i + 1 }
        name { Faker::Name.name }
        email { Faker::Internet.email }
        phone { Faker::PhoneNumber.phone_number  }
        payments { build_list :payment, 1, amount: show_time.price }
    end
end
