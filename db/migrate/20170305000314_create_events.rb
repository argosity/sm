class CreateEvents < ActiveRecord::Migration[5.0]
    def change
        create_table :events, partition_key: :tenant_id do |t|
            t.integer :tenant_id, null: false

            t.string :slug, null: false

            t.text :title, null: false
            t.text :page_html, :page_src,
                   :sub_title,
                   :description

            t.datetime :occurs_at,
                       :visible_after, :visible_until,
                       :onsale_after, :onsale_until, null: false

            t.decimal  :price, precision: 15, scale: 2, null: false
            t.integer :capacity, null: false

            t.references :presenter
            t.references :venue, null: false

            t.timestamps null: false
        end
    end
end
