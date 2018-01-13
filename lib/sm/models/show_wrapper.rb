require 'ostruct'

module SM
    module Models
        class ShowWrapper < OpenStruct

            def occurs
                times.map{|t| Time.parse(t['occurs_at']).in_time_zone(venue['timezone']) }
            end

            def has_common_time?
                occurs.uniq{|t| t.strftime('%H:%M') }.length == 1
            end

            def can_purchase?
                true
            end

            def has_info?
                page.present? || external_url.present?
            end

            def info_url
                if page.present?
                    "#info/#{identifier}"
                elsif external_url.present?
                    external_url
                else
                    ''
                end
            end

        end
    end
end
