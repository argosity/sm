require 'active_support/core_ext/integer/inflections'
module SM::Templates
    class Tickets < PDF
        identifier 'tickets'

        def record
            @record ||= SM::Purchase.find_by(identifier: id)
        end

        def variables
            super.merge({
                purchase: record
            })
        end

    end
end
