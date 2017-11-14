FactoryGirl.define do
    factory :show_time, class: SM::ShowTime do
        tenant { Hippo::Tenant.current }
        association :show
        occurs_at { rand(show.visible_during) || Date.today }
    end
end
