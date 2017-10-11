class CreateSquareAuths < ActiveRecord::Migration[5.0]
    def change
        create_table :square_auths do |t|
            t.references :tenant, null: false, foreign_key: { unique: true }

            t.string :token, :merchant_id, null: false

            t.string :location_id, :location_name

            t.timestamp :expires_at, null: false, index: true
        end

        add_column :shows, :config, :jsonb, default: {}
        add_column :show_times, :config, :jsonb, default: {}
    end
end
