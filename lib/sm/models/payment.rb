require 'braintree'

module SM

    class Payment < Model
        belongs_to_tenant

        belongs_to :sale

        attr_accessor :nonce

        validates :amount, :card_type, :digits, presence: true
    end

end
