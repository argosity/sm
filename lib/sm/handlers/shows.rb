require 'hippo/api/controller_base'
require 'axlsx'

module SM

    module Handlers
        # exposes an show record to the public via a CORS enabled endpoing,
        # without authentication
        # Care is taken to only expose a few attributes of SKU's marked as "public"
        class Shows < Hippo::API::ControllerBase

            attr_reader :view, :embed

            def show
                MultiTenant.with(nil) {
                    @embed = SM::Embed.find_by_identifier(params['embed_id'])
                }
                return purchase_json if 'purchase' == params['view']

                @view = SM::Templates::View.new(params['view'])

                case params['view']
                when 'listing'
                    listing
                when 'info'
                    view.variables.merge!(
                        embed: embed, show: SM::Show.find_by_identifier(params['id'])
                    )
                else
                    listing
                end
                view.as_html
            end

            def listing
                shows = embed.current_shows #SM::Embed.current_shows(params['embed_id'])
                if shows.none?
                    view.basename = 'no-shows'
                else
                    view.variables.merge!(embed: embed, shows: shows)
                end
            end

            def purchase_json
                {
                    css_values: embed.css_values,
                    show: embed.find_show(params['id']).to_h,
                    vendor: SM::Payments.vendor_name,
                    authorization: SM::Payments.vendor.payment_authorization
                }.to_json
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
