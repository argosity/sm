# This file will be loaded as part of Lanes startup.
#
# Extensions are called in load order, so be aware latter extensions may
# override config options specified
Lanes.configure do | config |
    # You can specify a different initial vew by setting it here
    # It must be set if the "Workspace" extension is disabled in
    # lib/sh/extension.rb
    # config.root_view = "Sh.Screens.<View Name>"
end

#FIXTURE_CONFIG = YAML.load(ERB.new(File.read("#{Rails.root}/path_to_your_file.yml.erb")).result)

require 'braintree'

bt = Lanes.config.secrets.braintree
Braintree::Configuration.environment = :sandbox
Braintree::Configuration.merchant_id = bt.merchant_id
Braintree::Configuration.public_key  = bt.pub_key
Braintree::Configuration.private_key = bt.priv_key
