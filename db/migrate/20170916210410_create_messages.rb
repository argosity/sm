class CreateMessages < ActiveRecord::Migration[5.0]
    def change
        create_table :messages do |t|
            t.references :tenant, null: false, foreign_key: true
            t.string :code, null: false
            t.string :name
            t.text :order_confirmation_subject
            t.text :order_confirmation_body
        end
        add_reference :venues, :message, foreign_key: true
        add_reference :shows, :message, foreign_key: true
    end
end
