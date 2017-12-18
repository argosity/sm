# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::Shows, api: true, vcr: VCR_OPTS do
    let!(:show) { FactoryBot.create :show }
    let (:embed) { FactoryBot.create :embed }
    let (:user) { FactoryBot.create :user }

    it "retrieves own shows" do
        get "/api/sm/embed/show-times/#{embed.identifier}.json"
        expect(last_response).to be_ok
    end

    it "can run a sales report as xls" do
        st = show.times[0]
        3.times { FactoryBot.create :sale, show_time: st }
        get "/api/sm/show-time/#{st.id}/sales-report.xlsx"
        expect(last_response).to be_ok
        expect(last_response.body.length).to be > 1000
    end

    it 'creates a Square item when updating a show' do
        sqa = FactoryBot.create :square_auth
        expect(SM::SquareAuth).to receive(:where).and_return([sqa])
        expect(sqa).to receive(:in_use?).and_return(true)
        expect(sqa).to receive(:upsert_item_for_show)

        with_payment_proccessor('Square') do
            put("/api/sm/show/#{show.id}.json",
                {title: 'A test of a show'}.to_json,
                {'CONTENT_TYPE' => 'application/json',
                 'HTTP_AUTHORIZATION' => user.jwt_token})
            expect(show.reload.title).to eq('A test of a show')
        end
    end
end
