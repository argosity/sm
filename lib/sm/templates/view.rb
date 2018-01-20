module SM
    module Templates
        class View < Hippo::Templates::View

            attr_accessor :basename

            def initialize(basename, params = {})
                super(params)
                @basename = basename
            end

            def root_path
                SM::ROOT_PATH.join('views')
            end

        end
    end
end
