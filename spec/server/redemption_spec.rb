require_relative 'spec_helper'

describe SM::Redemption do

    it "can be instantiated" do
        model = SM::Redemption.new
        expect( model ).to be_an(SM::Redemption)
    end

end
