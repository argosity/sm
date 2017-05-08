require 'pathname'
require 'yaml'
require_relative '../lib/sm'

system = SM::Tenant.system
MultiTenant.with(system) do
    Hippo::User.seed_admin_account
end

testing = SM::Tenant.find_or_create_by(slug: 'test', name: 'testing tenant', email: 'test@test.com')
MultiTenant.with(testing) do
    Hippo::User.seed_admin_account
end
