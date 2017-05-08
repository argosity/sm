module SM
    module Templates
        class Mail < Hippo::Templates::Liquid
            extension_id :sm

            def pathname
                root_path.join('mail', filename)
            end
        end
    end
end
