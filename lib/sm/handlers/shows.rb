require 'hippo/api/controller_base'
require 'axlsx'

module SM

    module Handlers
        # exposes an show record to the public via a CORS enabled endpoing,
        # without authentication
        # Care is taken to only expose a few attributes of SKU's marked as "public"
        class Shows < Hippo::API::ControllerBase

            def show
                std_api_reply(:retrieve, SM::Embed.json_for(params['id']))
            end


            def self.xls_sale_report(show_id, headers)
                st = SM::ShowTime.find(show_id)
                pkg = Axlsx::Package.new do |p|
                    p.workbook.add_worksheet(:name => "Basic Worksheet") do |sheet|
                        sheet.add_row([st.show.title])
                        time = st.occurs_at_in_venue_tz
                        sheet.add_row([time.strftime("%I:%M%P %a %b #{time.day.ordinalize}, %Y")])
                        sheet.merge_cells "A1:F1"
                        sheet.merge_cells "A2:F2"
                        sheet.add_row(
                            ['Name', 'Phone', 'Email', 'Created At', 'Qty', 'Redemptions']
                        )
                        st.sales.with_details.order(name: 'desc').find_each do |s|
                            sheet.add_row(
                                [
                                    s.name, s.phone, s.email,
                                    s.created_at.strftime('%Y-%m-%d'), s.qty,
                                    s.redemptions.count
                                ]
                            )
                        end
                    end
                    p.use_shared_strings = true
                end
                headers.merge!(
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Disposition' => "attachment; filename=#{st.show.title.parameterize}-#{st.occurs_at.strftime('%Y-%m-%d')}.xlsx"
                )
                pkg.to_stream
            end
        end
    end

end
