require_relative './spec_helper'


describe "Printing templates" do
    let(:presenter) { FactoryGirl.create :presenter }
    let(:event) { FactoryGirl.create :event, presenter: presenter }
    let(:purchase) { FactoryGirl.create :purchase, event: event }
    let(:ticket) { Hippo::Templates::Latex.for_identifier('tickets') }

    it "can generate a pdf for a ticket" do
        event.build_image({ file: Pathname.new(__FILE__).dirname.join('../fixtures/logo.png').open })
        presenter.build_logo({ file: Pathname.new(__FILE__).dirname.join('../fixtures/presenter.png').open })
        presenter.save!
        event.save!
        form = ticket.new(purchase.identifier)
        File.open('/tmp/test.pdf', 'w') {|f| f.write form.as_pdf.read }
    end


end
