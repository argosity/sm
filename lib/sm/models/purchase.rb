module SM
    class Purchase < Model
        belongs_to_tenant
        has_random_identifier

        belongs_to :event
        belongs_to :occurrence, class_name: 'SM::EventOccurrence'
        has_many :payments, autosave: true

        before_validation :set_defaults

        validates :event, presence: true
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

        protected

        def set_defaults
            Hippo.logger_debug "Has EveOcc: #{occurrence}"
            self.event ||= occurrence.event if occurrence
        end
    end
end
