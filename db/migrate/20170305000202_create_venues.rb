class CreateVenues < ActiveRecord::Migration[5.0]
    def change
        create_table :venues do |t|
            t.references :tenant, null: false, foreign_key: true

            t.string :code, null: false
            t.string :timezone, null: false
            t.text :name, null: false
            t.text :address, :phone_number
            t.integer :capacity, null: false
            t.integer :online_sales_halt_mins_before, null: false, default: 30
            t.timestamps null: false
        end
    end
end
