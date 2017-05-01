require_relative 'spec_helper'

describe sm::Embed do

    it "can be instantiated" do
        model = sm::Embed.new
        expect( model ).to be_an(sm::Embed)
    end

end
