# This file will be loaded as part of Hippo startup.
#
# Extensions are called in load order, so be aware latter extensions may
# override config options specified

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
