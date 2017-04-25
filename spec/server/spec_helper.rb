require_relative '../../lib/sm'
require 'factory_girl'
require 'faker'

require 'lanes/db'
Lanes::DB.establish_connection

TEST_TENANT = SM::Tenant.find_or_create_by(slug: 'test', name: 'testing tenant', email: 'test@test.com')
MultiTenant.with(TEST_TENANT) do
    require 'lanes/spec_helper'
end


module PaymentHelpers
    def with_payment_proccessor

        allow(SM::BraintreeConfig).to receive(:system_settings_values) {
            { 'merchant_id' => 'dshtky2jcjpr96z3',
              'public_key'  => 'hm7n6vc84jbr962w',
              'private_key' => '413cb3c8af29b3c3ba340cfb715f4532' }
        }
        yield
    end
end


# Configure RSpec to your liking
RSpec.configure do |config|

    config.include PaymentHelpers
    config.around(:each) do |example|
        MultiTenant.with(TEST_TENANT) do
            example.run
        end
    end
    config.before(:suite) do
        MultiTenant.with(TEST_TENANT) do
            Lanes::User.seed_admin_account
        end
        SM::Tenant.find_or_create_by(slug: 'test', name: 'testing tenant', email: 'test@test.com')
    end
end
