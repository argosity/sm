class AddTenantIds < ActiveRecord::Migration[5.0]
    def change

        [:users, :assets, :system_settings].each do | table |
            add_column table, :tenant_id, :integer
            change_column_null table, :tenant_id, false
        end

        add_index :system_settings, [:id, :tenant_id], unique: true

        add_index :users, [:login, :tenant_id], unique: true
    end
end
