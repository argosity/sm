require_relative 'spec_helper'

describe sh::Presenter do

    it "can be instantiated" do
        model = sh::Presenter.new
        expect( model ).to be_an(sh::Presenter)
    end

end
