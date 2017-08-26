module SM
    class EventOccurrence < Model
        has_random_identifier

        belongs_to_tenant
        belongs_to :event, export: true
        has_many :redemptions, inverse_of: :occurrence, listen: { create: :on_redemption }

        validates :occurs_at, presence: true

        scope :sales, lambda { |*|
            compose_query_using_detail_view(view: 'event_sales', join_to: 'event_occurrence_id')
        }, export: true

        def price
            ours = super
            ours.blank? ? event.price : ours
        end

        private

        def on_redemption(redemption)
            Hippo::API::PubSub.publish(
                "/event/redemption/#{self.id}", {
                    purchase_id: redemption.purchase_id,
                    created_at: redemption.created_at,
                    qty: redemption.qty,
                }
            )
        end
    end
end
