module SM
    class Sale < Model
        belongs_to_tenant
        has_random_identifier

        belongs_to :show_time
        belongs_to :attendee
        has_one :show, through: :show_time
        has_many :payments, autosave: true
        has_many :redemptions, inverse_of: :sale

        validates :qty,        presence: true
        validates :show_time,  presence: true
        validates :attendee,   presence: true

        scope :with_details, lambda { |should_use = true|
            compose_query_using_detail_view(view: 'sale_details', join_to: 'sale_id') if should_use
        }, export: true

        def pathname
            root_path.join('mail', filename)
        end

        def pdf_download_url
            tenant.url
        end

        def total
            show_time.price * qty
        end

        def tickets_url
            tenant.url +
                Hippo.config.api_path +
                Hippo.config.print_path_prefix +
                '/tickets/' + identifier + '.pdf'
        end

        def unredeemed_qty
            self.qty - redemptions.sum(:qty)
        end

    end
end
