class CreateShowDetails < ActiveRecord::Migration[5.0]

    def change
        create_view :show_details
    end

end
