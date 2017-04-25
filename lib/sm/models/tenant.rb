module SM
    # Tenant
    class Tenant < Model
        validates :slug, uniqueness: true
        validates :name, :email, presence: true
        has_random_identifier
        has_many :users, class_name: 'Lanes::User', autosave: true

        accepts_nested_attributes_for :users

        before_validation :auto_assign_slug, on: :create
        validates :users, associated: true, on: :create

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
                    newslug = Lanes::Strings.code_identifier(self.name, length: i + 5)
                    self.slug = newslug if Tenant.where(slug: newslug).none?
                end
                break if slug.present?
            end
            slug.downcase! if slug
        end

        def self.signup(params)
            t = Tenant.new(params.slice(:email))
            t.name = params['company']
            t.users.build(params.slice(:name, :email, :login, :password))
            if t.valid?
                mail = Lanes::Mailer.create(
                    to: t.email, subject: 'Thanks for signing up for ShowMaker'
                )
                mail.body = SM::Templates::Signup.new(t).render
                mail.deliver
            end
            t.save
            t
        end

    end
end
