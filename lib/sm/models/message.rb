require 'liquid'

module SM

    class Message < Model
        belongs_to_tenant

        has_one :ticket_header, as: :owner, class_name: 'Hippo::Asset',
                dependent: :destroy, export: true

        has_one :ticket_footer,  -> { where owner_type: "TicketFooter"},
                class_name: 'Hippo::Asset', foreign_key: :owner_id,
                foreign_type: :owner_type, dependent: :destroy, export: true

        validate :ensure_source_is_valid


        protected

        def ensure_source_is_valid
            [:order_confirmation_subject, :order_confirmation_body].each do |attr|
                content = self[attr]
                next unless content.present?
                begin
                    ::Liquid::Template.parse(content, :error_mode => :strict)
                rescue Liquid::SyntaxError => e
                    errors.add(attr, e.message)
                end
            end
        end

    end

end
