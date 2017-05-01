class CreateEmbeds < ActiveRecord::Migration[5.0]
    def change
        create_table :embeds, partition_key: :tenant_id do |t|
            t.integer :tenant_id, null: false
            t.text :name, null: false
            t.text :random_identifier, :name, null: false
            t.text :tenants, array: true, default: []
            t.timestamps null: false
        end
        add_index :embeds, :random_identifier, :unique => true
    end
end
