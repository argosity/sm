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
                    return std_api_reply(:update, {}, success: true)
                end
                if data['refund']
                    sale.is_voided = true
                    unless data['void_only']
                        unless process_refund(sale)
                            return std_api_reply(:update, sale, success: false)
                        end
                    end
                    return std_api_reply(:update, sale, success: sale.save)
                end
                return std_api_reply(:update, {}, success: true)
            end

            def show
                perform_retrieval
            end

            private

            def process_refund(sale)
                success = sale.payments.all? do |payment|
                    payment.refund(reason: data['refund'])
                end
                Hippo.logger.info "Refund of sale #{sale.identifier} processed success: #{success}"
                return false unless success
                begin
                    SM::Templates::Refund.create(sale).deliver
                rescue => e
                    Hippo.logger.warn "Failed to send refund email for sale #{sale.identifier}: #{e}"
                    return false
                end
                true
            end

        end
    end
end
