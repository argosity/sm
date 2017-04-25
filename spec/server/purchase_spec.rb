require_relative 'spec_helper'

describe SM::Purchase do
    let (:event) { FactoryGirl.create :event }

    it "can be instantiated" do
        purchase = SM::Purchase.new(
            qty: 1, name: 'Test',
            event: event,
            payments: [
                SM::Payment.new(
                    card_type: 'Visa', digits: '22', processor_transaction: '1234'
                )
            ]
        )
        tf=Tempfile.new
        tf.write fixtures_path.join('logo.png').read
        tf.rewind
        event.build_image(file: {
            type: "image/png", name: "file",
            filename: "Screen Shot 2016-10-28 at 5.15.37 PM.png",
            head: "Content-Disposition: form-data; name=\"file\"; filename=\"Screen Shot 2016-10-28 at 5.15.37 PM.png\"\r\nContent-Type: image/png\r\n",
            tempfile: tf
        })
        event.save!
        expect(purchase.save).to be(true)
        # puts SM::Templates::Purchase.new(purchase).render
    end
end
