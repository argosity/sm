module SM

    class Show < Model

        belongs_to_tenant
        has_random_identifier

        belongs_to :venue
        belongs_to :presenter

        has_one :image, as: :owner, class_name: 'Hippo::Asset', dependent: :destroy, export: true

        has_many :page_images, -> { where owner_type: "PageImage" },
                 class_name: 'Hippo::Asset', foreign_key: :owner_id,
                 foreign_type: :owner_type,
                 dependent: :destroy

        has_many :times, class_name: 'SM::ShowTime', dependent: :destroy, export: { writable: true }

        before_validation :set_defaults
        validates :venue, :title, :price, :visible_during, presence: true
        validates :capacity, presence: true

        scope :with_details, lambda { |should_use = true|
            compose_query_using_detail_view(view: 'show_details', join_to: 'show_id') if should_use
        }, export: true

        protected

        def set_defaults
            self.capacity ||= venue.capacity if venue.present?
            if external_url.present? && !external_url.start_with?('http')
                self.external_url = "http://#{external_url}"
            end
        end

    end

end
