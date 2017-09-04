module SM

    class Redemption < Model
        belongs_to_tenant

        belongs_to :purchase
        belongs_to :show
        belongs_to :occurrence, class_name: 'SM::Occurrence'

        validates :show, :purchase, :occurrence, presence: true
        validate :ensure_qty_is_correct
        before_validation :set_defaults

        protected

        def ensure_qty_is_correct
            if purchase && purchase.unredeemed_qty < qty
                errors.add(:qty, "must be less than #{purchase.unredeemed_qty}")
            end
        end

        def set_defaults
            self.occurrence ||= purchase.occurrence if purchase
            self.show ||= occurrence.show if occurrence
        end
    end

end
