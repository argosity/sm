class HtmlShowPages < ActiveRecord::Migration[5.0]
    def change
        execute 'update shows set page = null'
        execute 'drop view public_shows'
        change_column :shows, :page, :text
        create_view :public_shows
    end
end
