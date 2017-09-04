module SM
    class ShowTime < Model
        has_random_identifier

        belongs_to_tenant
        belongs_to :show, export: true
        has_many :redemptions, inverse_of: :time, listen: { create: :on_redemption }

        validates :occurs_at, presence: true

        scope :sales, lambda { |*|
            compose_query_using_detail_view(view: 'show_sales', join_to: 'show_time_id')
        }, export: true

        def price
            ours = super
            ours.blank? ? show.price : ours
        end

        def occurs_at_in_venue_tz
            show.venue.time_in_zone(occurs_at)
        end

        private

        def on_redemption(redemption)
            Hippo::API::PubSub.publish(
                "/show/redemption/#{self.id}", {
                    purchase_id: redemption.purchase_id,
                    created_at: redemption.created_at,
                    qty: redemption.qty,
                }
            )
        end
    end
end
