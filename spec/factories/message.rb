FactoryGirl.define do
    factory :message, class: Sm::Message do
        tenant { Hippo::Tenant.current }
        code { Hippo::Strings.random(10) }
        name { Faker::Name.name }
        order_confirmation_subject { "{{ sale.name }} {{ show.title }} #{Faker::Hipster.sentence}" }
        order_confirmation_body {
            '{{ show_time.price }} {{ show.title }} {{ sale.name }}' + Faker::Matz.quote
        }
    end
end
