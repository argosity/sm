class PageContents < ActiveRecord::Migration[5.0]
    def change
        add_column :shows, :page_delta, :jsonb
    end
end
