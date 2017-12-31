module SM

    class Show < Model

        belongs_to_tenant
        has_random_identifier

        belongs_to :venue
        belongs_to :presenter
        belongs_to :message
        has_one :image, as: :owner, class_name: 'Hippo::Asset', dependent: :destroy, export: true

        has_many :page_images, -> { where owner_type: "PageImage" },
                 class_name: 'Hippo::Asset', foreign_key: :owner_id,
                 foreign_type: :owner_type,
                 dependent: :destroy

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

        def public_json
            json = as_json(only: %w{identifier title sub_title description external_url can_purchase page visible_during price capacity online_sales_halt_mins_before}).merge(
                'times' => times.map { | st | st.as_json(only: %w{identifier occurs_at price capacity}) })
            json['first_show_time'] = times.first.occurs_at if times.any?
            json['image'] = image.file_data if image
            if presenter.present?
                json['presenter'] = { 'name' => presenter.name }
                json['presenter']['logo'] = presenter.logo.file_data if presenter.logo?
            end
            if venue.present?
                json['venue'] = venue.as_json(only: %w{ name address phone_number})
                json['venue']['logo'] = venue.logo.file_data if venue.logo
            end
            json
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
