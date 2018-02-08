# This file will be loaded as part of Hippo startup.
#
# Extensions are called in load order, so be aware latter extensions may
# override config options specified
Hippo.configure do | config |
    # You can specify a different initial vew by setting it here
    # It must be set if the "Workspace" extension is disabled in
    # lib/sh/extension.rb
    config.website_domain = ENV['HOST'] || 'https://showmaker.com'
    config.asset_host = ENV['ASSET_HOST']
    config.product_name = 'Show Maker'
    config.support_email = 'support@showmaker.com'
end

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
