module Sh

    # All models in Sh will inherit from
    # this common base class.
    class Model < Lanes::Model

        self.abstract_class = true

    end

    autoload :Event, "sh/models/event"
    autoload :Events, "sh/models/events"
end
