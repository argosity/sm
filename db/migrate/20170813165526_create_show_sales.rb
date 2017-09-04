class CreateShowSales < ActiveRecord::Migration[5.0]
    def change
        create_view :show_sales
    end
end
