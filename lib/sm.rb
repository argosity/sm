require "lanes"
require 'require_all'
require_relative "sm/version.rb"
require_relative "sm/extension.rb"
require_relative "sm/tenant_domain_router"

module SM
    def self.system_settings
        Lanes::SystemSettings.for_ext('sm')
    end
end

## A workaround for .constantize converting 'sm/foo' into 'Sm::Foo'
Kernel::Sm = SM

require_relative "sm/multi_tenant_modifications"
require_relative "sm/braintree_config"
require_relative "sm/model"
require_relative "sm/access_roles"
require_rel "sm/handlers/*.rb"
require_relative "sm/templates/mail.rb"
require_rel "sm/templates/*.rb"
