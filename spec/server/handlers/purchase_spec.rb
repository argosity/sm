# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Purchase, api: true, vcr: VCR_OPTS do
    let (:event) { FactoryGirl.create :event }
    let (:request_data) {
        {
            name: "nathan",
            phone: "6522",
            email: "test@test.com",
            qty: "1",
            event_id: event.id,
            payments: [
                { nonce: "fake-valid-nonce",
                  amount: event.price,
                  card_type: "Visa",
                  digits: "11" }
            ]
        }
    }

    it "saves a transaction" do
        with_payment_proccessor do
            expect {
                post '/api/sm/public/purchase.json', request_data.to_json
            }.to change { SM::Purchase.count }.by(1)
            expect(last_response).to be_ok
        end
    end

    it 'sends meaninful error messages when card fails' do
        event.update_attributes(price: '2001.00')
        with_payment_proccessor do
            expect {
                post '/api/sm/public/purchase.json', request_data.to_json
                expect(last_response_json['errors']).to eq({'payment' => 'Insufficient Funds'})
                expect(last_response_json['message']).to eq('Create failed: Payment Insufficient Funds')
            }.to change { SM::Purchase.count }.by(0)
            expect(last_response.status).to eq(406)
        end
    end

    it 'sends email' do
        with_payment_proccessor do
            expect {
                post '/api/sm/public/purchase.json', request_data.to_json
            }.to change { SM::Purchase.count }.by(1)
            expect(last_response).to be_ok
            purchase = SM::Purchase.find(last_response_json['data']['id'])
            expect(purchase.email).to eq('test@test.com')
            email = Mail::TestMailer.deliveries.last
            expect(email.to).to eq(['test@test.com'])
            expect(email.subject).to include("tickets for #{event.title}")
        end
    end

end
