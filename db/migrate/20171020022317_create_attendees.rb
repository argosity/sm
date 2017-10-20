class CreateAttendees < ActiveRecord::Migration[5.0]
    def change
        create_table :attendees do |t|
            t.references :tenant, null: false, foreign_key: true
            t.text :name, null: false
            t.text :phone
            t.text :email, null: false, index: true
            t.jsonb :metadata, default: {}
        end

        execute 'insert into attendees (tenant_id, name, phone, email) select tenant_id, name, phone, email from sales'

        add_reference :sales, :attendee

        execute <<-EOS
          update sales
          set attendee_id=attendees.id
          from attendees where attendees.email=sales.email
        EOS

        change_column :sales, :attendee_id, :int, null: false

        remove_column :sales, :name
        remove_column :sales, :phone
        remove_column :sales, :email

        update_view :sale_details, version: 2, revert_to_version: 1
    end
end
