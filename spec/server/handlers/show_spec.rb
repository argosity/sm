# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Shows, api: true, vcr: VCR_OPTS do
    let!(:show) { FactoryGirl.create :show }
    let (:embed) { FactoryGirl.create :embed }

    it "retrieves own shows" do
        get "/api/sm/embed/show-times/#{embed.identifier}.json"
        expect(last_response).to be_ok
    end

    it "can run a sales report as xls" do
        st = show.times[0]
        3.times { FactoryGirl.create :sale, show_time: st }
        get "/api/sm/show-time/#{st.id}/sales-report.xlsx"
        expect(last_response).to be_ok
        expect(last_response.body.length).to be > 1000
    end
end
