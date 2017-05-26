class CreatePublicEvents < ActiveRecord::Migration[5.0]
    def change
        create_view :public_events
    end
end
