FactoryGirl.define do
    factory :show, class: SM::Show do
        tenant {  Hippo::Tenant.current }

        title { Faker::RockBand.name }
        sub_title { "with #{Faker::Superhero.name}" }
        description { Faker::Company.catch_phrase }
        visible_during { (Time.now - (rand * 10).to_i.days)...(Time.now + (rand * 10).to_i.days) }
        price { (rand*100).round(2) }
        capacity { (rand*100).to_i }

        online_sales_halt_mins_before  { (rand*90).to_i + 30 }
        can_purchase { true }
        association :venue, factory: :venue
        transient do
            number_of_times { (rand(4) + 1) }
        end

        after :create do |show, evaluator|
            FactoryGirl.create_list :show_time, evaluator.number_of_times,
                                    show: show, tenant: show.tenant
            show.reload
        end
    end
end
