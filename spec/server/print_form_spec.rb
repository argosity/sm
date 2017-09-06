require_relative './spec_helper'


describe "Printing templates" do
    let(:presenter) { FactoryGirl.create :presenter }
    let(:show) { FactoryGirl.create :show, presenter: presenter }
    let(:purchase) { FactoryGirl.create :purchase, show_time: show.times.first }
    let(:ticket) { Hippo::Templates::Latex.for_identifier('tickets') }

    it "can generate a pdf for a ticket" do
        expect(purchase.show_time).not_to be_nil
        expect(purchase.show_time.occurs_at_in_venue_tz).not_to be_nil
        show.build_image({ file: Pathname.new(__FILE__).dirname.join('../fixtures/logo.png').open })
        presenter.build_logo({ file: Pathname.new(__FILE__).dirname.join('../fixtures/presenter.png').open })
        presenter.save!
        show.save!
        form = ticket.new(purchase.identifier)
        File.open('/tmp/test.pdf', 'w') {|f| f.write form.as_pdf.read }
    end


end
