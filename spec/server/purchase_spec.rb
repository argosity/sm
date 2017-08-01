require_relative 'spec_helper'

describe SM::Purchase do
    let (:event) { FactoryGirl.create :event, number_of_occurances: 1 }

    it "can be instantiated" do
        expect(event.occurrences.length).not_to equal(0)
        purchase = SM::Purchase.new(
            qty: 1, name: 'Test', event: event, occurrence: event.occurrences.first,
            payments: [
                SM::Payment.new(
                    card_type: 'Visa', digits: '22', processor_transaction: '1234', amount: event.price
                )
            ]
        )
        expect(purchase.save).to be(true)
    end
end
