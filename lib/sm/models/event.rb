module SM

    class Event < Model

        acts_as_tenant
        has_random_identifier

        belongs_to :venue
        belongs_to :presenter

        validates :venue, :title, :price, :occurs_at,
                  :visible_after, :visible_until, :onsale_after, :onsale_until,
                  presence: true

        validates :capacity, presence: true

        before_validation :set_defaults,  on: :create

        has_one :image, as: :owner, class_name: 'Lanes::Asset', dependent: :destroy, export: true

        scope :with_details, lambda { |should_use = true|
            compose_query_using_detail_view(
                view: 'event_details', join_to: 'event_id'
            ) if should_use
        }, export: true

        has_many :page_images, -> { where owner_type: "PageImage"},
                class_name: 'Lanes::Asset', foreign_key: :owner_id,
                foreign_type: :owner_type,
                dependent: :destroy


        protected

        def set_defaults
            self.capacity ||= venue.capacity if venue.present?
        end

    end

end
