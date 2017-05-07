module SM
    class Purchase < Model
        acts_as_tenant
        has_random_identifier

        belongs_to :event
        has_many :payments, autosave: true

        validates :event, presence: true
        validates :qty, :name, presence: true
        validates :payments, associated: true, presence: true, length: { is: 1 }

        def pathname
            root_path.join('mail', filename)
        end

        def first_name
            name.split(' ', 2).first
        end

        def last_name
            name.split(' ', 2).last
        end

        def pdf_download_url
            tenant.url
        end

        def total
            payments.sum(&:amount)
        end

        def tickets_url
            tenant.url +
                Lanes.config.api_path +
                Lanes.config.print_path_prefix +
                '/tickets/' + identifier + '.pdf'
        end

    end
end
