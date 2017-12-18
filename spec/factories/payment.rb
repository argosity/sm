FactoryBot.define do
    factory :payment, class: SM::Payment do
        card_type 'Visa'
        digits '22'
        processor_transaction '1234'
    end
end
