class CreateTenants < ActiveRecord::Migration[5.0]
    def change
        create_table :tenants do |t|
            t.string :slug, :email, null: false

            t.text   :random_identifier, :name, null: false

            t.text :address, :phone_number
            t.integer :subscription, limit: 1
            t.timestamps null: false
        end
    end
end
