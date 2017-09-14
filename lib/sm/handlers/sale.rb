require 'hippo/api/controller_base'
require 'braintree'

module SM
    module Handlers
        class Sale < Hippo::API::ControllerBase

            def update
                purchase = SM::Purchase.find(params[:id])
                binding.pry
                if data['send_receipt']
                    purchase.email = data['send_receipt']
                    Hippo::Tenant.system.perform do
                        SM::Templates::Purchase.create(purchase).deliver
                    end
                end
                std_api_reply(:update, {}, success: true)
            end

        end
    end
end
