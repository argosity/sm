module SM
    module Payments
        module MockProvider
            extend self
            def payment_authorization
                'none'
            end

            def sale(payment)
                payment.processor_transaction = 'test'
                payment.processor_id = :testing
                ChargeResult.new(
                    success: true,
                    message: Payments::SUCCESS_MSG,
                )
            end

        end
    end
end
