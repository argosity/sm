module SM
    module Payments

        class ChargeResult

            attr_reader :success, :message

            def initialize(success:, message:)
                @success = success
                @message = message
            end

            def ok?
                success
            end

        end

    end
end
