require_relative 'spec_helper'

describe SM::SaleReport do

    it "emails upcoming shows" do
        show = FactoryBot.create :show, number_of_times: 1
        show_time = show.times.last
        show_time.update_attributes(occurs_at: Time.now + 10.minutes)
        SM::SaleReport.email_pending

        emails = Mail::TestMailer.deliveries
        expect(emails.length).to eq(1)
        mail = emails.last
        expect(mail.to).to eq([Hippo::Tenant.current.email])
        expect(mail.attachments.length).to eq(1)
        expect(mail.attachments.first.filename).to match /\.xls$/
    end

end
