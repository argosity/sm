module SM

    module Templates
        class Ticket < Lanes::Templates::Latex
            model ::SM::Purchase
            extension_id :sm

            def record
                @record ||= model.find_by(random_identifier: id)
            end
        end
    end
end
