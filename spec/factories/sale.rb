FactoryGirl.define do
    factory :sale, class: SM::Sale do
        tenant { Hippo::Tenant.current }

        association :show_time, factory: :show_time
        association :attendee, factory: :attendee
        qty { (rand * 4).to_i + 1 }
        payments { build_list :payment, 1, amount: show_time.price }
    end
end
