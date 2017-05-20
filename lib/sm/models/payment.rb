require 'braintree'

module SM

    class Payment < Model
        belongs_to_tenant

        belongs_to :purchase

        attr_accessor :nonce

        validates :amount, :card_type, :digits, presence: true
    end

end
