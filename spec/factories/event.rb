FactoryGirl.define do
    factory :event, class: SM::Event do
#        association :tenant, factory: :tenant, strategy: :build

        title { Faker::RockBand.name }
        sub_title { "with #{Faker::Superhero.name}" }
        description { Faker::Company.catch_phrase }

        visible_after { Time.now - (rand * 10).to_i.days }
        visible_until { Time.now + (rand * 10).to_i.days }

        occurs_at { Time.now + (rand * 2).to_i.days }

        onsale_after { visible_after + (rand * 3).to_i.days }
        onsale_until { visible_until - (rand * 3).to_i.days }

        price { (rand*100).round(2) }
        capacity { (rand*100).to_i }

        association :venue, factory: :venue

    end
end
