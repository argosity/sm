require 'hippo/api/controller_base'

module SM
    module Handlers
        class Sale < Hippo::API::ControllerBase

            def update
                sale = SM::Sale.find_by(identifier: params[:id])
                if data['send_receipt']
                    sale.email = data['send_receipt']
                    SM::Templates::Sale.create(sale).deliver
                end
                std_api_reply(:update, {}, success: true)
            end

            def show
                perform_retrieval
            end

        end

    end
end
