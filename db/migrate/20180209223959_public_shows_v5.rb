class PublicShowsV5 < ActiveRecord::Migration[5.0]
    def change
        update_view :public_shows, version: 5, revert_to_version: 4
    end
end
