require_relative '../../lib/sm'
require 'factory_girl'
require 'faker'
require 'hippo/spec_helper'

require 'hippo/db'
Hippo::DB.establish_connection

module PaymentHelpers
    def with_payment_proccessor
        allow(SM::BraintreeConfig).to receive(:system_settings_values) {
            { 'sandbox_mode' => true,
              'merchant_id'  => 'dshtky2jcjpr96z3',
              'public_key'   => 'hm7n6vc84jbr962w',
              'private_key'  => '413cb3c8af29b3c3ba340cfb715f4532' }
        }
        yield
    end
end


# Configure RSpec to your liking
RSpec.configure do |config|

    config.include PaymentHelpers

end
