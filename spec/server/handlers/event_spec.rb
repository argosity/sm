# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Events, api: true, vcr: VCR_OPTS do
    let!(:events) { FactoryGirl.create :event }
    let (:embed) { FactoryGirl.create :embed }

    it "retrieves own events" do
        get "/api/sm/embed/events/#{embed.identifier}.json"
        expect(last_response).to be_ok
    end
end
