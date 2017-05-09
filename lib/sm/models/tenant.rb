module SM
    # Tenant
    class Tenant < Model
        validates :slug, uniqueness: { case_sensitive: false }
        validates :name, :presence => { message: 'for company' }
        validates :email, :presence => true

        has_random_identifier
        has_many :users, class_name: 'Hippo::User', autosave: true
        has_many :embeds, autosave: true

        accepts_nested_attributes_for :users

        before_validation :auto_assign_slug, on: :create
        validates :users, associated: true, on: :create

        before_validation :setup_default_associations, on: :create
        after_save :after_tenant_slug_updated, if: :slug_changed?

        def self.system
            find_by(slug: 'system') ||
                create!(
                    slug: 'system', name: 'system',
                    email: 'contact@argosity.com', subscription: :admin
                )
        end

        enum subscription: [:free, :paid, :admin]

        def url
            "https://#{slug}.showmaker.com"
        end

        def auto_assign_slug
            5.times do |i|
                if slug.blank?
                    newslug = Hippo::Strings.code_identifier(self.name, length: i + 5).downcase
                    self.slug = newslug if Tenant.where(slug: newslug).none?
                end
                break if slug.present?
            end
        end

        # convenience method
        def self.current
            MultiTenant.current_tenant
        end

        def self.signup(params)
            t = Tenant.new(params.slice(:email))
            self.transaction do
                t.name = params['company']
                MultiTenant.with(t) do
                    t.users.build(params.slice(:name, :email, :login, :password))
                    if t.save
                        MultiTenant.with(Tenant.system) do
                            SM::Templates::Signup.create(t).deliver
                        end
                    end
                end
            end
            t
        end

        def setup_default_associations
            embeds.build(name: 'My events', tenants: [self.slug]) if embeds.none?
        end

        def after_tenant_slug_updated
            Embed.update_tenant_slugs(slug_was, slug)
        end
    end
end
