module SM

    class Venue < Model
        acts_as_tenant

        has_code_identifier from: :name

        validates :name, :capacity, presence: true

        has_one :logo, as: :owner, class_name: 'Hippo::Asset',
                dependent: :destroy, export: true
    end

end
