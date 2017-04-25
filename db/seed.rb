require 'pathname'
require 'yaml'
require_relative '../lib/sm'

tenant = SM::Tenant.system
MultiTenant.with(tenant) do
    Lanes::User.seed_admin_account
end
