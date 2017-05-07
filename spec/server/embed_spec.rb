require_relative 'spec_helper'

describe SM::Embed do
    let(:event) do
        FactoryGirl.create(:event,
                           visible_after: 3.days.ago,
                           visible_until: 2.days.from_now)
    end
    let(:embed) { SM::Embed.first }
    it "can query events" do
        event_identifier = event.identifier
        json = SM::Embed.json_for(embed.identifier)
        expect(json.map { |e| e['identifier'] }).to include(event_identifier)
    end
end
