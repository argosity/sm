class CreateEventDetails < ActiveRecord::Migration[5.0]

    def change
        create_view :event_details
    end

end
