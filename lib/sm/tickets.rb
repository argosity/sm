module SM

    module Templates
        class Ticket < Hippo::Templates::Latex
            model ::SM::Purchase
            extension_id :sm

            def record
                @record ||= model.find_by(random_identifier: id)
            end
        end
    end
end
