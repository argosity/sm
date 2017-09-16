module SM

    class Redemption < Model
        belongs_to_tenant

        belongs_to :sale
        belongs_to :show
        belongs_to :show_time, class_name: 'SM::ShowTime'

        validates :show, :sale, :show_time, presence: true
        validate :ensure_qty_is_correct
        before_validation :set_defaults

        protected

        def ensure_qty_is_correct
            if sale && sale.unredeemed_qty < qty
                errors.add(:qty, "must be less than #{sale.unredeemed_qty}")
            end
        end

        def set_defaults
            if sale
                self.show ||= sale.show
                self.show_time ||= sale.show_time
            end
        end
    end

end
