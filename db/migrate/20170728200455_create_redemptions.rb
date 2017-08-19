class CreateRedemptions < ActiveRecord::Migration[5.0]
    def change
        create_table :redemptions do |t|
            t.references :tenant, null: false, foreign_key: true
            t.integer :qty, null: false
            t.references :purchase, null: false, foreign_key: true
            t.references :event, null: false, foreign_key: true
            t.references :occurrence, null: false

            t.timestamp :created_at, null: false, default: -> { 'now()' }
        end
    end
end