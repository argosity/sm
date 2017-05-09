# This file will be loaded as part of Hippo startup.
#
# Extensions are called in load order, so be aware latter extensions may
# override config options specified
Hippo.configure do | config |
    # You can specify a different initial vew by setting it here
    # It must be set if the "Workspace" extension is disabled in
    # lib/sh/extension.rb
end

require 'braintree'

bt = Hippo.config.secrets.braintree
Braintree::Configuration.environment = :sandbox
Braintree::Configuration.merchant_id = bt.merchant_id
Braintree::Configuration.public_key  = bt.pub_key
Braintree::Configuration.private_key = bt.priv_key

token = Hippo.config.secrets.dig('rollbar', 'server')
if token
    require 'rollbar/middleware/sinatra'
    Rollbar.configure do |config|
        config.access_token = token
        config.enabled = Hippo.env.production?
    end
    if Hippo::API.const_defined?(:Root)
        Hippo::API::Root.use Rollbar::Middleware::Sinatra
    end
end
