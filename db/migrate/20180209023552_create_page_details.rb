class CreatePageDetails < ActiveRecord::Migration[5.0]
    def change
        create_view :page_details
    end
end
