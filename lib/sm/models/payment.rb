require 'braintree'

module SM

    class Payment < Model
        acts_as_tenant

        belongs_to :purchase

        attr_accessor :nonce

        validates :amount, :card_type, :digits, presence: true
    end

end
