module SM
    module Templates
        class PDF < Hippo::Templates::Latex
            extension_id :sm

            def self.inherited(klass)
                Hippo::Templates::Latex::ALL << klass
            end

        end
    end
end
