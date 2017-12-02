class CancelSales < ActiveRecord::Migration[5.0]
    def change
        add_column :sales, :is_voided, :boolean, default: 'f', null: false
        update_view :sale_details, version: 4, revert_to_version: 3
    end
end
