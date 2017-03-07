require_relative 'spec_helper'

describe sh::Events do

    it "can be instantiated" do
        model = sh::Events.new
        expect( model ).to be_an(sh::Events)
    end

end
