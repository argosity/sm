FactoryGirl.define do
    factory :event_occurrence, class: SM::EventOccurrence do
        association :tenant, strategy: :build
        association :event,  strategy: :build
        occurs_at { rand(event.visible_during) }
    end
end
