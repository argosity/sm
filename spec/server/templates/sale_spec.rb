require_relative '../spec_helper'

describe SM::Templates::Sale do
    let (:presenter) { FactoryGirl.create :presenter }
    let (:show) { FactoryGirl.create :show, presenter: presenter, number_of_times: 1, price: 11.2 }
    let (:sale) { FactoryGirl.create :sale, show_time: show.times[0] }

    it "sends an using a custom message" do
        show.build_image({ file: Pathname.new(__FILE__).dirname.join('../../fixtures/logo.png').open })
        presenter.build_logo({ file: Pathname.new(__FILE__).dirname.join('../../fixtures/presenter.png').open })
        presenter.save!
        show.message = FactoryGirl.create :message
        show.save!

        email = SM::Templates::Sale.create(sale)
        expect(email.to).to eq [sale.attendee.email]
        expect(email.subject).to include show.title
        expect(email.body.raw_source).to include show.title
        expect(email.body.raw_source).to include sale.attendee.name
    end

end
