class CreateEmbeds < ActiveRecord::Migration[5.0]
    def change
        create_table :embeds do |t|
            t.references :tenant, null: false, foreign_key: true
            t.text :name, null: false
            t.text :identifier, :name, null: false
            t.text :tenants, array: true, default: []
            t.timestamps null: false
        end
        add_index :embeds, :identifier, :unique => true
    end
end
