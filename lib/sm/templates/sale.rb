module SM

    module Templates
        class Sale < Mail

            def self.default_subject
                "Your tickets for {{show.title}}"
            end

            def self.default_body
                SM::ROOT_PATH.join('templates', 'mail', 'sale.liquid').read
            end

            attr_reader :sale

            def initialize(sale)
                @sale = sale
            end

            def pathname
                root_path.join('mail', filename)
            end

            def subject
                if custom_message
                    ::Liquid::Template
                        .parse(custom_message.order_confirmation_subject)
                        .render(variables)
                else
                    "Your tickets for #{sale.show.title}"
                end
            end

            def to
                sale.email
            end

            def custom_message
                sale.show.message
            end

            def source
                custom_message ? custom_message.order_confirmation_body : super
            end

            def variables
                show = sale.show
                tenant = sale.tenant
                vars = {
                    'seller' => {
                        name: tenant.name,
                        logo: image_json(Hippo::SystemSettings.config.logo)
                    },
                    'sale' => sale.as_json(
                        methods: %w{tickets_url total},
                        only: %w{identifier name email qty tickets_url}
                    ),
                    'venue' => show.venue.as_json(only: %w{name address}),
                    'show' => show.as_json(only: %w{title sub_title description})
                                  .merge('image' => image_json(show.image)),
                    'show_time' => {
                        'price' => sale.show_time.price,
                        'occurs_at' => sale.show_time.occurs_at_in_venue_tz
                    }
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
