require_relative '../spec_helper'

describe "Contact Form", api: true, vcr: VCR_OPTS do

    it "can submit" do
        expect {
            response = post(
                '/contact',
                {'name'=>'Bob', 'email'=>'test@test.com', 'subject'=>'hi', 'message'=>'this is a test'}
            )
            expect(response.status).to eq 302
            expect(response.location).to match /\/contact-submitted$/
        }.to change { Mail::TestMailer.deliveries.count }.by(1)
        email = Mail::TestMailer.deliveries.last
        expect(email.to).to eq([Hippo.config.support_email])
        expect(email.subject).to eq '[Show Maker Contact] hi'
        expect(email.reply_to).to eq ['test@test.com']
        expect(email.body.to_s).to include 'Contact form submission from Bob test@test.com'
        expect(email.body.to_s).to include 'this is a test'
    end

end
