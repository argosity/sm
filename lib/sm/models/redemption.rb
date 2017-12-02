module SM

    class Redemption < Model
        belongs_to_tenant

        belongs_to :sale
        belongs_to :show
        belongs_to :show_time, class_name: 'SM::ShowTime'

        validates :show, :sale, :show_time, presence: true
        validate :ensure_redeemable
        before_validation :set_defaults

        attr_accessor :ticket

        whitelist_attributes :ticket

        protected

        def ensure_redeemable
            return unless sale
            if sale.unredeemed_qty < qty
                if sale.unredeemed_qty > 0
                    errors.add(:qty, "must be less than #{sale.unredeemed_qty}")
                else
                    errors.add(:sale, 'is completely checked in')
                end
            end
            if sale.is_voided?
                errors.add(:sale, 'has been voided')
            end
        end

        def set_defaults
            if ticket
                identifier = ticket.split(':').first
                self.sale = SM::Sale.where(identifier: identifier).first
            end
            if sale
                self.show ||= sale.show
                self.show_time ||= sale.show_time
            end
        end
    end

end
