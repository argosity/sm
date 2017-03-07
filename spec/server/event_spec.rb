require_relative 'spec_helper'

describe Sh::Event do
    it "can be instantiated" do
        model = Sh::Event.new
        expect(model).to be_an(Sh::Event)
    end
end
