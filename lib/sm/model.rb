require 'activerecord-multi-tenant'

module SM
    # All models in SM will inherit from
    # this common base class.
    class Model < Hippo::Model
        self.abstract_class = true
    end
end

require_relative "models/presenter"
require_relative "models/show"
require_relative "models/occurrence"
require_relative "models/venue"
require_relative "models/payment"
require_relative "models/purchase"
require_relative "models/redemption"
require_relative "models/embed"
