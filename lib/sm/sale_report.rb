module SM

    class SaleReport
        attr_reader :show_time

        def initialize(show_time)
            @show_time = show_time
        end

        def file_name
            "#{show_time.show.title.parameterize}-#{show_time.occurs_at.strftime('%Y-%m-%d')}"
        end

        def xls
            pkg = Axlsx::Package.new do |p|
                p.workbook.add_worksheet(:name => "Basic Worksheet") do |sheet|
                    sheet.add_row([show_time.show.title])
                    time = show_time.occurs_at_in_venue_tz
                    sheet.add_row([time.strftime("%I:%M%P %a %b #{time.day.ordinalize}, %Y")])
                    sheet.merge_cells "A1:F1"
                    sheet.merge_cells "A2:F2"
                    sheet.add_row(
                        ['Name', 'Phone', 'Email', 'Created At', 'Qty', 'Redemptions']
                    )
                    show_time.sales.with_details.order(name: 'desc').find_each do |s|
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
            pkg
        end

        def SaleReport.email_pending
            SM::ShowTime.where("occurs_at between now() and now() + interval '30 minutes'").each do |st|
                sr = SM::SaleReport.new(st)
                SM::Templates::SaleReport.create(sr).deliver
            end
                # "select * from public_shows where embed_identifier = #{conn.quote(identifier)} and visible_during @> now()::timestamp order by first_show_time"
        end
    end

end
