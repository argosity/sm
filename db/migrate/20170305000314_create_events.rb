class CreateEvents < ActiveRecord::Migration[5.0]
    def change
        create_table :events do |t|
            t.string  :code, null: false

            t.text :title, null: false
            t.text :sub_title, :info, :venue, :email_from,
                   :email_signature, :post_purchase_message
            t.datetime :starts_at
            t.integer :max_attendance
            t.timestamps null: false
        end
    end
end
