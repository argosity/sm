module SM
    module Templates
        class Mail < Hippo::Templates::Mail
            extension_id :sm

            def root_path
                SM::ROOT_PATH.join('templates')
            end

            def pathname
                root_path.join('mail', filename)
            end

        end
    end
end
