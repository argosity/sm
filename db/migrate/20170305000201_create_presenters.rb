class CreatePresenters < ActiveRecord::Migration[5.0]
    def change
        create_table :presenters do |t|
            t.references :tenant, null: false, foreign_key: true
            t.string :code, :name, null: false
            t.timestamps null: false
        end
    end
end
