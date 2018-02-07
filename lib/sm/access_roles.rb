require 'hippo/access'
require_relative "model"

# Access control
module Hippo::Access

    module Roles

        # anyone can edit
        class BasicUser
            grant SM::Show
            grant SM::Sale
            grant SM::Venue
            grant SM::Presenter
            grant SM::Embed
            grant SM::ShowTime
            grant SM::Payment
            grant SM::Redemption
            grant SM::Message
            grant SM::Page
        end

    end

end
