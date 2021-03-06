FactoryBot.define do
    factory :show, class: SM::Show do
        tenant {  Hippo::Tenant.current }

        title { "#{ Faker::Color.color_name.capitalize} #{Faker::Lovecraft.deity}"  }
        sub_title { "with #{Faker::Superhero.name}" }
        description { Faker::Company.catch_phrase }
        visible_during {
            (Time.now - (Faker::Number.between(0, 10)).days)...(Time.now + Faker::Number.between(1, 10).days)
        }
        price { Faker::Number.between(5, 25) }
        capacity { Faker::Number.between(50, 250) }

        online_sales_halt_mins_before  { Faker::Number.between(5, 30) }
        can_purchase { true }
        association :venue, factory: :venue
        transient do
            number_of_times { Faker::Number.between(1, 5) }
        end

        trait :with_page do
            after :create do |show, evaluator|
                FactoryBot.create :page, owner: show
            end
        end

        after :create do |show, evaluator|
            FactoryBot.create_list :show_time, evaluator.number_of_times,
                                   show: show, tenant: show.tenant
            show.reload
        end
    end
end
