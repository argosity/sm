class CreatePresenters < ActiveRecord::Migration[5.0]
    def change
        create_table :presenters, partition_key: :tenant_id  do |t|
            t.integer :tenant_id, null: false
            t.string :code, :name, null: false
            t.timestamps null: false
        end
    end
end
