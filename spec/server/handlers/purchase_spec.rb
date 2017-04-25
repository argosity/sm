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
                  card_type: "Visa",
                  digits: "11" }
            ]
        }
    }

    it "saves a transaction" do
        with_payment_proccessor do
            expect {
                post '/api/sh/public/purchase.json', request_data.to_json
            }.to change { SM::Purchase.count }.by(1)
            expect(last_response).to be_ok
        end
    end

    it 'sends meaninful error messages when card fails' do
        event.update_attributes(price: '2001.00')
        with_payment_proccessor do
            expect {
                post '/api/sh/public/purchase.json', request_data.to_json
                expect(last_response_json['errors']).to eq({'payment' => 'Insufficient Funds'})
                expect(last_response_json['message']).to eq('Create failed: Payment Insufficient Funds')
            }.to change { SM::Purchase.count }.by(0)
            expect(last_response.status).to eq(406)
        end
    end

    it 'sends email' do
        with_payment_proccessor do
            post '/api/sh/public/purchase.json', request_data.to_json
            expect(last_response).to be_ok
            email = Mail::TestMailer.deliveries.last
            expect(email.from).to eq(['tester@test.com'])
            expect(email.subject).to include("tickets for #{event.title}")
        end
    end

    # it 'saves arbitrary json on pdf' do
    #     custom = data
    #     custom[:options][:xtrablah] = { one: 1 }
    #     with_stubbed_payment_proccessor(authorization: 'yep-it-works') do
    #         post '/api/skr/public/sales.json', custom
    #     end
    #     assert_ok
    #     invoice = Invoice.find_by_hash_code(json_data.hash_code)
    #     assert_equal( { 'one' => 1 }, invoice.options['xtrablah'] )
    # end

    # it 'can use fields from an event' do
    #     event = skr_event(:top)
    #     data[:options][:event_id] = event.id
    #     with_stubbed_payment_proccessor(authorization: 'yep-it-works') do
    #         post '/api/skr/public/sales.json', data
    #     end
    #     assert_ok
    #     invoice = Invoice.find_by_hash_code(json_data.hash_code)
    #     assert invoice.event, 'event is not set'
    #     email = Mail::TestMailer.deliveries.last
    #     assert email, 'email failed to send'
    #     assert_equal email.from, [event.email_from]
    #     assert_includes email.body, event.email_signature
    #     assert 'ticket', invoice.form
    # end

end
