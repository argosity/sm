require 'bundler'
Bundler.require
lib = "./lib"
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require_relative 'lib/sm'
require 'hippo/db'
Hippo::DB.establish_connection

MultiTenant.with(SM::Tenant.system) do
    require 'hippo/api'
    run Hippo::API::Root
end
