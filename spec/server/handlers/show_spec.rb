# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Shows, api: true, vcr: VCR_OPTS do
    let!(:shows) { FactoryGirl.create :show }
    let (:embed) { FactoryGirl.create :embed }

    it "retrieves own shows" do
        get "/api/sm/embed/shows/#{embed.identifier}.json"
        expect(last_response).to be_ok
    end
end
