require 'activerecord-multi-tenant'
require 'lanes/multi_server_boot'
require 'lanes/db'
require 'lanes/user'

[
    Lanes::SystemSettings,
    Lanes::Asset,
    Lanes::User
].each do |klass|
    klass.belongs_to :tenant, class_name: 'SM::Tenant'
    klass.multi_tenant :tenant
end

[:login, :email].each do |field|
    validator = Lanes::User._validators[field].find{|v| v.is_a? ActiveRecord::Validations::UniquenessValidator }
    validator.instance_variable_set(:@options, validator.options.merge({ :scope => :tenant_id }))
end

module Lanes

    module MultiServiceBoot
        class << self
            alias_method :original_perform, :perform

            def perform
                Lanes::DB.establish_connection
                MultiTenant.with(SM::Tenant.system) do
                    original_perform
                end
            end
        end
    end

    class User
        class <<self
            alias_method :original_seed_admin_account,:seed_admin_account

            def seed_admin_account
                tenant = MultiTenant.current_tenant || SM::Tenant.system
                MultiTenant.with(tenant) do
                    original_seed_admin_account
                end
            end
        end
    end

    module MultiTenantAuthentication
        def wrap_model_access(model, req, options = {})
            fail_request(req) and return unless MultiTenant.current_tenant
            super
        end
    end

    class Lanes::API::AuthenticationProvider
        prepend MultiTenantAuthentication
    end

    class Configuration

        class << self
            alias_method :original_apply, :apply

            def apply
                Lanes::DB.establish_connection
                tenant = MultiTenant.current_tenant || SM::Tenant.system
                MultiTenant.with(tenant) do
                    original_apply
                end
            end
        end

    end
end
