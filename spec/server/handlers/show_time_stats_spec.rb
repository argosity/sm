# coding: utf-8
require_relative '../spec_helper'

describe SM::Handlers::ShowTimeStats, api: true, vcr: VCR_OPTS do

    let(:show_time) { FactoryBot.create :show_time }
    let(:user) { FactoryBot.create :user }

    it "retrieves show stats" do
        3.times do
            sale = SM::Sale.new(qty: 1, show_time: show_time)
            sale.attendee = SM::Attendee.new(name: 'Tester')
            sale.save!
        end
        show_time.sales.last.redemptions.create!(qty: 1)

        get( "/api/sm/show-time/stats/#{show_time.id}.json", {},
             {'HTTP_AUTHORIZATION' => user.jwt_token})

        expect(last_response).to be_ok
        expect(last_response_json['data']).to(
            include(
                'sales' => 3,
                'redemptions' => 1
            )
        )
    end

end
