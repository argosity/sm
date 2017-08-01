module SM

    module Templates
        class Purchase < Mail

            attr_reader :purchase

            def initialize(purchase)
                @purchase = purchase
            end

            def pathname
                root_path.join('mail', filename)
            end

            def subject
                "Your tickets for #{purchase.event.title}"
            end

            def to
                purchase.email
            end

            def variables
                vars = {
                    'company_name' => purchase.tenant.name,
                    'purchase' => purchase.as_json(only: %w{identifier name email qty}),
                    'event' => purchase.event
                                   .as_json(only: %w{title sub_title description occurs_at})
                                   .merge('image' => image_json(purchase.event.image))
                }
                if purchase.event.presenter
                    vars['presenter'] = purchase.event.presenter
                                            .as_json(only: %w{name})
                                            .merge('logo' => image_json(purchase.event.presenter.logo))
                end
                vars
            end

            def image_json(img)
                return nil unless img
                tn = img.file_data['thumbnail']
                {
                    'url' => purchase.tenant.url + img.path('thumbnail')
                }.merge(
                    tn['metadata'].slice('width', 'height')
                )
            end
        end
    end

end
