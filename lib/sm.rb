require "hippo"
require 'require_all'
require_relative "sm/version.rb"
require_relative "sm/extension.rb"

module SM
    def self.system_settings
        Hippo::SystemSettings.for_ext('sm')
    end

    ROOT_PATH = Pathname.new(__FILE__).dirname.join('..')
end

## A workaround for .constantize converting 'sm/foo' into 'Sm::Foo'
Kernel::Sm = SM

require_relative "sm/tenant_extensions"
require_rel "sm/concerns/*.rb"
require_relative "sm/model"
require_relative "sm/payments"
require_relative "sm/access_roles"
require_rel "sm/handlers/*.rb"
require_relative "sm/templates/mail"
require_relative "sm/templates/pdf"
require_rel "sm/templates/*.rb"
