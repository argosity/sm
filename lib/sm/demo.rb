require 'factory_bot'
require 'faker'

module SM
    module Demo

        mattr_accessor :tenant, :venues, :shows

        def self.update
            FactoryBot.definition_file_paths = Hippo::Extensions.map do |ext|
                ext.root_path.join('spec/factories')
            end
            FactoryBot.find_definitions
            Faker::Config.random = Random.new(123)
            self.tenant = SM::Demo::Tenant.update
            self.tenant.perform do
                self.venues = SM::Demo::Venues.update
                SM::Demo::Shows.update
            end
        end

    end
end

require_rel './demo/*rb'

Hippo::Cron.daily do
    SM::Demo.update
end
