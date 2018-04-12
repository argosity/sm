module SM
    class ShowTime < Model

        has_random_identifier

        belongs_to_tenant
        belongs_to :show, export: true
        has_many :sales, inverse_of: :show_time
        has_many :redemptions, inverse_of: :show_time, listen: { create: :on_redemption }
        has_many :sales
        validates :occurs_at, presence: true

        export_join_tables :shows

        scope :purchasable, lambda { |can_purchase = true|
            joins(:show).where(shows: { can_purchase: (can_purchase == true || can_purchase == 'true') })
        }, export: true

        def price
            ours = super
            ours.blank? ? show.price : ours
        end

        def occurs_at_in_venue_tz
            show.venue.time_in_zone(occurs_at)
        end

        def date_identifier
            occurs_at_in_venue_tz.strftime('%Y-%m-%d_%H:%M')
        end

        def can_purchase?
            show.can_purchase && occurs_at > Time.now
        end

        def can_purchase_online?
            show.can_purchase && occurs_at > (Time.now + show.online_sales_halt_mins_before.minutes)
        end

        private

        def on_redemption(redemption)
            Hippo::API::PubSub.publish(
                "/show/redemption/#{self.id}", {
                    sale_id: redemption.sale_id,
                    created_at: redemption.created_at,
                    qty: redemption.qty,
                }
            )
        end

    end
end
