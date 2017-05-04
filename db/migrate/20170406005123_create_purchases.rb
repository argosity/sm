class CreatePurchases < ActiveRecord::Migration[5.0]
    def change
        create_table :purchases, partition_key: :tenant_id do |t|
            t.integer :tenant_id, :event_id, null: false
            t.integer :qty, null: false

            t.text    :identifier, :name, null: false
            t.text    :phone, :email

            t.timestamps null: false
        end
        add_index :purchases, :identifier, :unique => true

        create_table :payments, partition_key: :tenant_id do |t|
            t.integer :tenant_id, :purchase_id, null: false
            t.decimal :amount, precision: 15, scale: 2, null: false

            t.text :card_type, :digits, :processor_transaction, null: false
        end
    end
end
