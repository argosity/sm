require_relative 'spec_helper'

describe SM::Presenter do

    it "can be instantiated" do
        model = SM::Presenter.new
        expect( model ).to be_an(SM::Presenter)
    end

end
