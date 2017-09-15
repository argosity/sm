class CreateSaleDetails < ActiveRecord::Migration[5.0]
    def change
        create_view :sale_details
    end
end
