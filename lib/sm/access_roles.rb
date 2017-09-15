require 'hippo/access'
require_relative "model"

# Access control
module Hippo::Access

    module Roles

        # anyone can edit
        class BasicUser
            grant SM::Show
            grant SM::Venue
            grant SM::Presenter
            grant SM::ShowTime
            grant SM::Payment
        end

    end

end
