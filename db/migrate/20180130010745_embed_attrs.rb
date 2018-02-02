class EmbedAttrs < ActiveRecord::Migration[5.0]
    def change
        add_column :embeds, :css_values, :jsonb, default: {}
    end
end
