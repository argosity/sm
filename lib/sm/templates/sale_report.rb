module SM

    module Templates
        class SaleReport < Mail

            attr_reader :show_time, :report

            def initialize(report)
                @report = report
                @show_time = report.show_time
            end

            def subject
                "Guest list for #{show_time.show.title}"
            end

            def to
                Hippo::Tenant.current.email
            end

            def variables
                show = show_time.show
                {
                    'show' => show.as_json(only: %w{title sub_title description}),
                    'show_time' => {
                        'occurs_at' => show_time.occurs_at_in_venue_tz
                    }
                }
            end

            def attachments
                attach = {}
                attach["#{report.file_name}.xls"] = report.xls.to_stream
                attach
            end
        end
    end

end
