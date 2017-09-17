require_relative './spec_helper'


xdescribe "Printing templates" do
    let(:presenter) { FactoryGirl.create :presenter }
    let(:message) { FactoryGirl.create :message }
    let(:show) { FactoryGirl.create :show, presenter: presenter, message: message }
    let(:sale) { FactoryGirl.create :sale, show_time: show.times.first }
    let(:ticket) { Hippo::Templates::Latex.for_identifier('tickets') }

    def file(name)
        Pathname.new(__FILE__).dirname.join("../fixtures/#{name}").open
    end

    it "can generate a pdf for a ticket" do
        expect(sale.show_time).not_to be_nil
        expect(sale.show_time.occurs_at_in_venue_tz).not_to be_nil
        show.build_image({ file: file('logo.png') })
        presenter.build_logo({ file: file('presenter.png') })
        presenter.save!
        message = show.build_message(code: 'TEST')
        message.build_ticket_header({ file: file('header.pdf') })
        message.build_ticket_footer({ file: file('footer.pdf') })
        message.save
        show.ticket_instructions = <<-EOS
              This is a test of the
              ticket footer.

              latex is escaped \Large foo
        EOS
        show.save!

        form = ticket.new(sale.identifier)

        File.open('/tmp/test.tex', 'w') {|f| f.write form.as_latex }
        File.open('/tmp/test.pdf', 'w') {|f| f.write form.as_pdf.read }

        puts form.engine.log
    end
end
