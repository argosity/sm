FactoryBot.define do
    factory :sale, class: SM::Sale do
        tenant { Hippo::Tenant.current }

        association :show_time, factory: :show_time
        association :attendee, factory: :attendee
        qty { Faker::Number.between(1, 4) }
        payments { build_list :payment, 1, amount: show_time.price }
    end
end
