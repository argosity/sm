require 'hippo/access'
require_relative "model"

# Access control
module Hippo::Access

    module Roles

        # anyone can edit
        class BasicUser
            grant SM::Event
            grant SM::Venue
            grant SM::Presenter
        end

    end

end
