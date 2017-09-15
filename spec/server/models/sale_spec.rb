require_relative '../spec_helper'

describe SM::Sale do
    let (:show) { FactoryGirl.create :show, number_of_times: 1 }

    it "can be instantiated" do
        expect(show.times.length).not_to equal(0)
        sale = SM::Sale.new(
            qty: 1, name: 'Test', show: show, show_time: show.times.first,
            payments: [
                SM::Payment.new(
                    card_type: 'Visa', digits: '22', processor_transaction: '1234', amount: show.price
                )
            ]
        )
        expect(sale.save).to be(true)
    end
end
