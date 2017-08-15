class CreateEventSales < ActiveRecord::Migration[5.0]
    def change
        create_view :event_sales
    end
end
