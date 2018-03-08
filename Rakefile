require_relative 'lib/sm'
require 'hippo/rake_tasks'
require_relative 'lib/sm/demo'

task :refresh_square_tokens => :env do
    SM::SquareAuth.refresh
end

namespace :demo do
    desc 'update demo data'
    task :update => :env do
        SM::Demo.update
    end
end
