class CreateSales < ActiveRecord::Migration[5.0]
    def change
        create_table :sales do |t|
            t.references :tenant, null: false, foreign_key: true

            t.integer :qty, null: false
            t.references :show_time, null: false

            t.text :identifier, null: false, index: { unique: true }
            t.text :name, null: false, index: true
            t.text :phone, :email

            t.timestamp :created_at, null: false
        end
    end
end
