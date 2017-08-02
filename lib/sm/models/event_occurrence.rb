module SM
    class EventOccurrence < Model
        belongs_to_tenant
        belongs_to :event
        has_random_identifier

        validates :occurs_at, presence: true
    end
end
