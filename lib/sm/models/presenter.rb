module SM

    class Presenter < Model
        belongs_to_tenant

        has_code_identifier from: :name
        has_one :logo, as: :owner, class_name: 'Hippo::Asset', dependent: :destroy, export: true

        validates :name, presence: true
    end

end
