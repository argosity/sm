module SM

    class Show < Model

        belongs_to_tenant
        has_random_identifier

        belongs_to :venue
        belongs_to :presenter
        belongs_to :message
        has_one :image, as: :owner, class_name: 'Hippo::Asset', dependent: :destroy, export: true
        has_one :page, as: :owner, class_name: 'SM::Page', dependent: :destroy, export: true

        has_many :times, -> { order('occurs_at') },
                 class_name: 'SM::ShowTime', autosave: true,
                 dependent: :destroy, export: { writable: true }

        before_validation :set_defaults
        validates :venue, :title, :price, :visible_during, presence: true
        validates :capacity, presence: true

        scope :with_details, lambda { |should_use = true|
            compose_query_using_detail_view(view: 'show_details', join_to: 'show_id') if should_use
        }, export: true

        scope :visible, lambda {|val|
            where('visible_during @> now()::timestamp') if val == 'true'
        }, export: true

        def can_purchase?
            can_purchase && times.any?{|t| t.occurs_at_in_venue_tz > Time.now }
        end

        protected

        def set_defaults
            self.capacity ||= venue.capacity if venue.present?
            if external_url.present? && !external_url.start_with?('http')
                self.external_url = "http://#{external_url}"
            end
        end

    end

end
