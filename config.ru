require 'bundler'
Bundler.require
lib = "./lib"
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require_relative 'lib/sm'
require 'lanes/db'
Lanes::DB.establish_connection

MultiTenant.with(SM::Tenant.system) do
    require 'lanes/api'
    run Lanes::API::Root
end
