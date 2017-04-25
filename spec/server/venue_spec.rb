require_relative 'spec_helper'

describe SM::Venue do

    it "can be instantiated" do
        model = SM::Venue.new
        expect( model ).to be_an(SM::Venue)
    end

end
