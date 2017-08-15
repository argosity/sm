module SM
    class EventOccurrence < Model
        has_random_identifier

        belongs_to_tenant
        belongs_to :event, export: true

        validates :occurs_at, presence: true

        scope :sales, lambda { |*|
            compose_query_using_detail_view(view: 'event_sales', join_to: 'event_occurrence_id')
        }, export: true

        def price
            ours = super
            ours.blank? ? event.price : ours
        end
    end
end
