require_relative 'spec_helper'

describe Event do

    it "can be instantiated" do
        model = Event.new
        expect( model ).to be_an(Event)
    end

end
