class CreatePurchases < ActiveRecord::Migration[5.0]
    def change
        create_table :purchases do |t|
            t.references :tenant, null: false, foreign_key: true

            t.integer :qty, null: false
            t.references :show, null: false
            t.references :show_time, null: false

            t.text    :identifier, :name, null: false
            t.text    :phone, :email

            t.timestamp :created_at, null: false
        end
        add_index :purchases, :identifier, unique: true
    end
end
