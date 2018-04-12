require 'hippo/api/controller_base'
require 'axlsx'

module SM
    module Handlers
        class ShowTimeStats < Hippo::API::ControllerBase

            def show
                st = ShowTime.find(params[:id])
                data = {
                    sales: st.sales.sum(:qty),
                    redemptions: st.redemptions.count,
                    timeline: st.sales.map{ |s| [s.created_at.to_i, s.qty] }
                }
                compare_to_id = params.dig('q', 'compare_to_id')
                if compare_to_id
                    compare = ShowTime.find(compare_to_id)
                    data['comparison_timeline'] = compare.sales.map{ |s| [s.created_at.to_i, s.qty] }
                end
                std_api_reply(:retrieve, data, success: true)
            end

        end
    end
end
