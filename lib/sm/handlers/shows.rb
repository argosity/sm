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
                view.variables[:embed] = embed
                shows = embed.current_shows
                if shows.none?
                    view.basename = 'no-shows'
                else
                    view.variables[:shows] = shows
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
                show_time = SM::ShowTime.find(show_id)
                report = SM::SaleReport.new(show_time)
                headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                headers['Content-Disposition'] = "attachment; filename=#{report.file_name}.xls"
                report.xls.to_stream
            end
        end
    end

end
