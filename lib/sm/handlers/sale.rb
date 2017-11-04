require 'hippo/api/controller_base'

module SM
    module Handlers
        class Sale < Hippo::API::ControllerBase

            def create
                sale = model.from_attribute_data(data, current_user)
                sale.attendee = Attendee.for_sale_data(data)
                sale.show_time = SM::ShowTime.preload(:show).find_by(
                    identifier: data['time_identifier']
                )
                options = build_reply_options.merge(success: sale.save)
                std_api_reply(:create, sale, options)
            end

            def update
                sale = SM::Sale.find_by(identifier: params[:id])
                if data['send_receipt']
                    sale.attendee.email = data['send_receipt']
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
