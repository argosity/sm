module SM

    class Venue < Model
        belongs_to_tenant

        has_code_identifier from: :name

        validates :name, :capacity, presence: true

        has_one :logo, as: :owner, class_name: 'Hippo::Asset',
                dependent: :destroy, export: true

        def time_in_zone(time)
            tz = ActiveSupport::TimeZone::MAPPING[self.timezone]
            time.in_time_zone(tz)
        end
    end



end
