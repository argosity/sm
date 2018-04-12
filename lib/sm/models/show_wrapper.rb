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
                halt = Time.now + self.online_sales_halt_mins_before.minutes
                !!(can_purchase && occurs.any? {|o| halt < o })
            end

            def has_page?
                page_id.present?
            end

            def has_info?
                has_page? || external_url.present?
            end

            def purchase_url
                if can_purchase?
                    "#purchase/#{identifier}"
                else
                    ''
                end
            end

            def info_url
                if has_page?
                    "#info/#{identifier}"
                elsif external_url.present?
                    external_url
                else
                    ''
                end
            end

            def to_h
                super.merge({
                                assets_url: Hippo.config.asset_host +
                                    Hippo.config.api_path +
                                    Hippo.config.assets_path_prefix
                            })
            end

        end
    end
end
