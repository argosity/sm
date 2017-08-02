module SM

    class Redemption < Model
        belongs_to_tenant

        belongs_to :purchase
        belongs_to :event
    end

end
