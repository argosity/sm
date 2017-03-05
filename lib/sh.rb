require "lanes"
require 'require_all'
require_relative "sh/version.rb"
require_relative "sh/extension.rb"

# The main namespace for Sh
module Sh

    def self.system_settings
        Lanes::SystemSettings.for_ext('sh')
    end

end

require_relative "sh/model"
