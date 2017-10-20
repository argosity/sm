require_relative '../spec_helper'

describe SM::Attendee do

    it "can be instantiated" do
        model = SM::Attendee.new(
            name: 'Test', email: 'test@test.com'
        )
        expect(model).to be_an(SM::Attendee)
    end

end
