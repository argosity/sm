class CreateShowTimes < ActiveRecord::Migration[5.0]
    def change
        create_table :show_times do |t|
            t.references :tenant, null: false, foreign_key: true
            t.string :identifier, null: false, index: { unique: true }
            t.references :show, null: false
            t.decimal    :price, precision: 15, scale: 2
            t.integer    :capacity
            t.datetime   :occurs_at, null: false
        end
    end
end
