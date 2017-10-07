module SM
    module Payments

        class ChargeResult

            attr_reader :transaction, :message, :success

            def initialize(transaction:, success:, message:)
                @transaction = transaction
                @success = success
                @message = message
            end

            def ok?
                success
            end

        end

    end
end
