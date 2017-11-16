# coding: utf-8
require_relative '../spec_helper'

[
    'Square',
    'Braintree'
].each do |paymentVendor|
    # { record: :all }
    describe "#{paymentVendor} Sale", api: true, vcr: VCR_OPTS do

        let (:venue) { FactoryGirl.create :venue }
        let (:show) { FactoryGirl.create :show, venue: venue }
        let (:request_data) {
            {
                name: "nathan",
                phone: "123-456-789",
                email: "test@test.com",
                qty: "1",
                time_identifier: show.times.first.identifier,
                payments: [
                    { nonce: payment_processor_nonce(paymentVendor),
                      card_type: "Visa",
                      digits: "11" }
                ]
            }
        }

        around(:each) do |spec|
            Hippo.silence_logs do # silence CC processing messages
                spec.run
            end
        end

        it "saves a transaction" do
            with_payment_proccessor(paymentVendor) do
                expect {
                    post('/api/sm/sale/submit.json',
                         request_data.to_json,
                         {'CONTENT_TYPE' => 'application/json'})
                }.to change { SM::Sale.count }.by(1)
                expect(last_response).to be_ok
                sale = SM::Sale.last
                expect(sale.attendee).to_not be_nil
            end
        end

        it 'sends meaninful error messages when card fails' do
            payment_processor_make_sale_invalid(show, paymentVendor)
            with_payment_proccessor(paymentVendor) do
                expect {
                    post('/api/sm/sale/submit.json',
                         request_data.to_json,
                         {'CONTENT_TYPE' => 'application/json'})
                }.to change { SM::Sale.count }.by(0)
                expect(last_response.status).to eq(406)
                expect(last_response_json['success']).to eq(false)
                expect(last_response_json['errors']).to have_key 'payment'
            end
        end

        it 'sends email' do
            with_payment_proccessor(paymentVendor) do
                expect {
                    post('/api/sm/sale/submit.json',
                         request_data.to_json,
                         {'CONTENT_TYPE' => 'application/json'})
                }.to change { SM::Sale.count }.by(1)
                expect(last_response).to be_ok
                sale = SM::Sale.find_by_identifier(response_data['identifier'])
                expect(sale.attendee.email).to eq 'test@test.com'
                email = Mail::TestMailer.deliveries.last
                expect(email.to).to eq([sale.attendee.email])
                expect(email.subject).to include("tickets for #{show.title}")
            end
        end

    end

end
