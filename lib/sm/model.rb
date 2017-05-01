require 'activerecord-multi-tenant'

module SM
    # All models in SM will inherit from
    # this common base class.
    class Model < Lanes::Model
        self.abstract_class = true

        def self.acts_as_tenant
            belongs_to :tenant
            multi_tenant :tenant
        end
    end
end

require_relative "models/tenant"
require_relative "models/event"
require_relative "models/venue"
require_relative "models/payment"
require_relative "models/purchase"
require_relative "models/presenter"
require_relative "models/embed"
