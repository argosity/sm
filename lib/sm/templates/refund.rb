require_relative './sale'

module SM

    module Templates
        class Refund < Sale

            def subject
                "Refund for your tickets for #{sale.show.title}"
            end

            def source
                pathname.read
            end

        end
    end
end
