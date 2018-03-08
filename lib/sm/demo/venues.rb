module SM::Demo

    module Venues
        IDS = %w(BELLE JOSSCH ELKUNZ)

        def self.update
            SM::Venue.where('code not in (?)', IDS).delete_all
            IDS.map do |code|
                attrs = FactoryBot.attributes_for(:venue, code: code)
                venue = SM::Venue.find_by(code: code) || SM::Venue.create(attrs)
                venue.update_attributes!(attrs)
                venue
            end
        end
    end

end
