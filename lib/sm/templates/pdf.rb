module SM
    module Templates
        class PDF < Hippo::Templates::Latex
            extension_id :sm

            def self.inherited(klass)
                Hippo::Templates::Latex::ALL << klass
            end

            def root_path
                SM::ROOT_PATH.join('templates', 'latex')
            end

        end
    end
end
