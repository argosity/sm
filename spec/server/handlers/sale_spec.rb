# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Sale, api: true, vcr: VCR_OPTS do
    let (:venue) { FactoryGirl.create :venue }
    let (:show) { FactoryGirl.create :show, venue: venue }
    let (:request_data) {
        {
            name: "nathan",
            phone: "6522",
            email: "test@test.com",
            qty: "1",
            time_identifier: show.times.first.identifier,
            payments: [
                { nonce: "fake-valid-nonce",
                  amount: show.price,
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
        with_payment_proccessor do
            expect {
                response = post '/api/sm/sale.json', request_data.to_json
            }.to change { SM::Sale.count }.by(1)
            expect(last_response).to be_ok
        end
    end

    it 'sends meaninful error messages when card fails' do
        show.update_attributes(price: '2001.00')
        with_payment_proccessor do
            expect {
                post '/api/sm/sale.json', request_data.to_json
                expect(last_response_json['errors']).to eq({'payment' => 'Insufficient Funds'})
                expect(last_response_json['message']).to eq('Create failed: Payment Insufficient Funds')
            }.to change { SM::Sale.count }.by(0)
            expect(last_response.status).to eq(406)
        end
    end

    it 'sends using a custom email' do
        with_payment_proccessor do
            FactoryGirl.create :message, show: show, order_confirmation_subject: 'Yo, You Ordered '
            expect {
                post '/api/sm/sale.json', request_data.to_json
            }.to change { SM::Sale.count }.by(1)
            expect(last_response).to be_ok
            sale = SM::Sale.find_by_identifier(response_data['identifier'])
            expect(sale.email).to eq 'test@test.com'
            email = Mail::TestMailer.deliveries.last
            expect(email.to).to eq([sale.email])
            expect(email.subject).to include("tickets for #{show.title}")
        end
    end

end