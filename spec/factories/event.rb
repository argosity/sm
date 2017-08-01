FactoryGirl.define do
    factory :event, class: SM::Event do
        tenant {  Hippo::Tenant.current }

        title { Faker::RockBand.name }
        sub_title { "with #{Faker::Superhero.name}" }
        description { Faker::Company.catch_phrase }
        visible_during { (Time.now - (rand * 10).to_i.days)...(Time.now + (rand * 10).to_i.days) }
        price { (rand*100).round(2) }
        capacity { (rand*100).to_i }
        can_purchase { true }
        association :venue, factory: :venue

        transient do
            number_of_occurances { (rand(4) + 1) }
        end

        after :create do |event, evaluator|
            FactoryGirl.create_list :event_occurrence, evaluator.number_of_occurances,
                                    event: event, tenant: event.tenant
            event.reload
        end
    end
end
