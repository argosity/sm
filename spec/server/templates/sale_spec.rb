require_relative '../spec_helper'

describe SM::Templates::Sale do
    let (:presenter) { FactoryGirl.create :presenter }
    let (:show) { FactoryGirl.create :show, presenter: presenter, number_of_times: 1, price: 11.2 }
    let (:sale) { FactoryGirl.create :sale, show_time: show.times[0] }

    it "saves a transaction" do

        show.build_image({ file: Pathname.new(__FILE__).dirname.join('../../fixtures/logo.png').open })
        presenter.build_logo({ file: Pathname.new(__FILE__).dirname.join('../../fixtures/presenter.png').open })
        presenter.save!
        show.save!
        email = SM::Templates::Sale.create(sale)
        File.write '/tmp/spendily-email.html', email.body.raw_source
    end

end
