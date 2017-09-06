module SM

    class Redemption < Model
        belongs_to_tenant

        belongs_to :purchase
        belongs_to :show
        belongs_to :time, class_name: 'SM::ShowTime'

        validates :show, :purchase, :time, presence: true
        validate :ensure_qty_is_correct
        before_validation :set_defaults

        protected

        def ensure_qty_is_correct
            if purchase && purchase.unredeemed_qty < qty
                errors.add(:qty, "must be less than #{purchase.unredeemed_qty}")
            end
        end

        def set_defaults
            self.time ||= purchase.time if purchase
            self.show ||= time.show if time
        end
    end

end
