module SM
    module Templates
        class PDF < Lanes::Templates::Latex
            extension_id :sm

            def self.inherited(klass)
                Lanes::Templates::Latex::ALL << klass
            end

        end
    end
end
