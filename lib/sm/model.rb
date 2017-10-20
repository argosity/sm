require 'activerecord-multi-tenant'

module SM
    # All models in SM will inherit from
    # this common base class.
    class Model < Hippo::Model
        self.abstract_class = true
    end
    autoload :Attendee, "sm/models/attendee"
end

require_relative "models/presenter"
require_relative "models/show"
require_relative "models/show_time"
require_relative "models/venue"
require_relative "models/payment"
require_relative "models/sale"
require_relative "models/redemption"
require_relative "models/embed"
require_relative "models/message"
require_relative "models/message"
require_relative "models/square_auth"
