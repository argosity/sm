class PublicShowsAddTimeZone < ActiveRecord::Migration[5.0]
    def change
        update_view :public_shows, version: 3, revert_to_version: 2
    end
end
