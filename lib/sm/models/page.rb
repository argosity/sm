module SM
    class Page < Model
        belongs_to_tenant
        belongs_to :owner, polymorphic: true

        has_many :images,
                 class_name: 'Hippo::Asset', as: :owner, dependent: :destroy
    end
end
