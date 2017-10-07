require_relative '../../lib/sm'
require 'factory_girl'
require 'faker'
require 'hippo/spec_helper'
require_relative 'payment_helpers'
require 'hippo/db'
Hippo::DB.establish_connection



# Configure RSpec to your liking
RSpec.configure do |config|

    config.include PaymentHelpers

end
