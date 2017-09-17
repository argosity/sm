require_relative '../spec_helper'

describe Sm::Message do

    it "validates the liquid source before save" do
        m = Sm::Message.new(
            order_confirmation_subject: 'foa {{',
            order_confirmation_body: 'foa {% bang_i_dunno %}'
        )
        expect(m.valid?).to be(false)
        expect(m.errors.full_messages[0]).to include "Variable '{{' was not properly terminated"
        expect(m.errors.full_messages[1]).to include "Unknown tag 'bang_i_dunno'"
    end

end
