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

        def pdf_download_url
            tenant.url
        end
    end
end
