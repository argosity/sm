class CreatePayments < ActiveRecord::Migration[5.0]
    def change
        create_table :payments do |t|
            t.references :tenant, null: false, foreign_key: true
            t.references :purchase, null: false, foreign_key: true
            t.decimal :amount, precision: 15, scale: 2, null: false
            t.text :card_type, :digits, :processor_transaction, null: false
        end
    end
end
