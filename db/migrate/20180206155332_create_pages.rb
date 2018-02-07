class CreatePages < ActiveRecord::Migration[5.0]
    def change
        create_table :pages do |t|
            t.references :tenant, null: false, foreign_key: true
            t.references :owner, polymorphic: true, index: true
            t.text :html, null: false
            t.jsonb :contents, null: false
        end
        update_view :public_shows, version: 4, revert_to_version: 3
        remove_column :shows, :page_delta, :jsonb
        remove_column :shows, :page, :text
    end
end
