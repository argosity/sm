FactoryGirl.define do
    factory :show_time, class: SM::ShowTime do
        association :tenant, strategy: :build
        association :show, strategy: :build
        occurs_at { rand(show.visible_during) }
    end
end
