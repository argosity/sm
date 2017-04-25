FactoryGirl.define do
    factory :payment, class: SM::Payment do
        association :tenant, factory: :tenant, strategy: :build
        card_type 'Visa'
        digits '22'
        processor_transaction '1234'
    end
end
