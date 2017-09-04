module SM
    class Purchase < Model
        belongs_to_tenant
        has_random_identifier

        belongs_to :show
        belongs_to :occurrence, class_name: 'SM::Occurrence'
        has_many :payments, autosave: true
        has_many :redemptions, inverse_of: :purchase
        before_validation :set_defaults

        validates :show, presence: true
        validates :occurrence, presence: true
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
                Hippo.config.api_path +
                Hippo.config.print_path_prefix +
                '/tickets/' + identifier + '.pdf'
        end

        def unredeemed_qty
            self.qty - redemptions.sum(:qty)
        end

        protected

        def set_defaults
            self.show ||= occurrence.show if occurrence
        end
    end
end
