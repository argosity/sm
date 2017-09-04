class CreatePublicShows < ActiveRecord::Migration[5.0]
    def change
        create_view :public_shows
    end
end
