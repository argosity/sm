class CreateRefunds < ActiveRecord::Migration[5.0]
    def change
        add_column :payments, :processor_id, :int, limit: 1
        add_column :payments, :metadata, :jsonb, default: {}, null: false
        add_column :payments, :refund_id, :text
        add_index :payments, '(refund_id is not null)',
                  name: 'index_payments_is_refunded'
        update_view :sale_details, version: 3, revert_to_version: 2
    end
end
