require 'active_support/core_ext/integer/inflections'
module SM::Templates
    class Tickets < PDF
        identifier 'tickets'

        def record
            @record ||= SM::Sale.find_by(identifier: id)
        end

        def variables
            super.merge({
                sale: record
            })
        end

    end
end
