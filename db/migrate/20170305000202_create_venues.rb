class CreateVenues < ActiveRecord::Migration[5.0]
    def change
        create_table :venues, partition_key: :tenant_id do |t|
            t.integer :tenant_id, null: false

            t.string :code, null: false

            t.text :name, null: false
            t.text :address, :phone_number
            t.integer :capacity, null: false

            t.timestamps null: false
        end
    end
end
