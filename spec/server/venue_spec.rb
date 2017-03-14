require_relative 'spec_helper'

describe sh::Venue do

    it "can be instantiated" do
        model = sh::Venue.new
        expect( model ).to be_an(sh::Venue)
    end

end
