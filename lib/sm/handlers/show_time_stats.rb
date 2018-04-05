require 'hippo/api/controller_base'
require 'axlsx'

module SM
    module Handlers
        class ShowTimeStats < Hippo::API::ControllerBase

            def show
                st = ShowTime.find(params[:id])
                std_api_reply(:retrieve, {
                                  sales: st.sales.sum(:qty),
                                  redemptions: st.redemptions.count,
                                  timeline: st.sales.map{|s|
                                      [s.created_at.to_i, s.qty]
                                  }
                              }, success: true)
            end

        end
    end
end
