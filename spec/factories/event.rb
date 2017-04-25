FactoryGirl.define do
    factory :event, class: SM::Event do
        association :tenant, factory: :tenant, strategy: :build

        slug { Faker::Ancient.primordial }

        title { Faker::RockBand.name }
        sub_title { "with #{Faker::Superhero.name}" }
        description { Faker::Company.catch_phrase }

        visible_after { Time.now - (rand * 10).to_i }
        visible_until { Time.now + (rand * 10).to_i }

        occurs_at { Time.now + (rand * 2).to_i }

        onsale_after { visible_after + (rand * 3).to_i }
        onsale_until { visible_until - (rand * 3).to_i }

        price { (rand*100).round(2) }
        capacity { (rand*100).to_i }

        association :venue, factory: :venue, strategy: :build

    end
end
