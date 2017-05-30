class CreateEvents < ActiveRecord::Migration[5.0]
    def change
        create_table :events, partition_key: :tenant_id do |t|
            t.integer :tenant_id, null: false

            t.string :identifier, null: false

            t.text :title, null: false
            t.text :external_url
            t.jsonb :page_src
            t.text :page_html,
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

        add_index :events, :identifier, :unique => true

        add_index :events, [:tenant_id, :visible_after, :visible_until]

    end
end
