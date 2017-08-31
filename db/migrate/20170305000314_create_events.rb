class CreateEvents < ActiveRecord::Migration[5.0]
    def change
        create_table :events do |t|
            t.references :tenant, null: false, foreign_key: true
            t.string :identifier, null: false

            t.text :title, null: false
            t.text :external_url
            t.jsonb :page
            t.text :sub_title,
                   :description

            t.tsrange :visible_during
            t.boolean :can_purchase, null: false, default: 'f'

            t.decimal :price, precision: 15, scale: 2, null: false
            t.integer :capacity, null: false

            t.references :presenter
            t.references :venue, null: false

            t.timestamps null: false
        end
        add_index :events, :identifier, unique: true
        add_index :events, [:tenant_id, :visible_during]
    end
end
