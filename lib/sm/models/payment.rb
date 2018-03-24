require 'braintree'

module SM

    class Payment < Model
        belongs_to_tenant

        belongs_to :sale

        attr_accessor :nonce

        enum processor_id: [ :braintree, :square, :stripe, :test ]

        validates :amount, :card_type, :digits, presence: true

        def processor
            SM::Payments.const_get(
                processor_id.capitalize
            )
        end

        def refund(reason:)
            processor.refund(self, reason)
        end
    end

end
