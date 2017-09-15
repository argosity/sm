class CreateRedemptions < ActiveRecord::Migration[5.0]
    def change
        create_table :redemptions do |t|
            t.references :tenant, null: false, foreign_key: true
            t.integer :qty, null: false
            t.references :sale, null: false, foreign_key: true
            t.references :show, null: false, foreign_key: true
            t.references :show_time, null: false

            t.timestamp :created_at, null: false, default: -> { 'now()' }
        end
    end
end
