module SM

    class Presenter < Model
        acts_as_tenant

        has_code_identifier from: :name
        has_one :logo, as: :owner, class_name: 'Lanes::Asset', dependent: :destroy, export: true

        validates :name, presence: true
    end

end
