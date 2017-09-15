module SM

    module Templates
        class Sale < Mail

            attr_reader :sale

            def initialize(sale)
                @sale = sale
            end

            def pathname
                root_path.join('mail', filename)
            end

            def subject
                "Your tickets for #{sale.show.title}"
            end

            def to
                sale.email
            end

            def variables
                show = sale.show
                vars = {
                    'company_name' => sale.tenant.name,
                    'sale' => sale.as_json(
                        methods: %w{ tickets_url },
                        only: %w{identifier name email qty tickets_url}
                    ),
                    'show' => show
                                  .as_json(only: %w{title sub_title description occurs_at})
                                  .merge('image' => image_json(show.image))
                }
                if show.presenter
                    vars['presenter'] = show.presenter
                                            .as_json(only: %w{name})
                                            .merge('logo' => image_json(show.presenter.logo))
                end
                vars
            end

            def image_json(img)
                return nil unless img
                tn = img.file_data['thumbnail']
                {
                    'url' => sale.tenant.url + img.path('thumbnail')
                }.merge(
                    tn['metadata'].slice('width', 'height')
                )
            end
        end
    end

end
