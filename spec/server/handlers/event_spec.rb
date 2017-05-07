# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Events, api: true, vcr: VCR_OPTS do
    let!(:events) { FactoryGirl.create :event }
    let (:embed) { FactoryGirl.create :embed }

    it "retrieves own events" do
        get "/api/sm/public/events/#{embed.identifier}.json"
        expect(last_response).to be_ok


        # with_payment_proccessor do
        #     expect {
        #         post '/api/sm/public/purchase.json', request_data.to_json
        #     }.to change { SM::Purchase.count }.by(1)
        #     expect(last_response).to be_ok
        # end
    end


end
