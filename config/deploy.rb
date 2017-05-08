set :application, 'stockor-saas'
set :repo_url, 'https://github.com/argosity/sm.git'
set :deploy_to, '/srv/www/showmaker.com'
set :passenger_restart_with_touch, true
set :conditionally_migrate, true
set :linked_files, %w(config/database.yml config/secrets.yml)
set :linked_dirs, %w(public/files log node_modules)
set :passenger_restart_with_touch, false

set :rollbar_env, Proc.new { fetch :stage }
set :rollbar_role, Proc.new { :app }

set :default_env, 'HIPPO_ENV' => 'production'

task :migrate do
    on roles(:db) do
        execute "cd #{release_path}; HIPPO_ENV=production bundle exec hippo db migrate"
        execute "cd #{release_path}; HIPPO_ENV=production bundle exec hippo db seed"
    end
end

task :yarn do
    on roles(:web) do
        execute "cd #{release_path}; yarn install"
    end
end

task :assets do
    on roles(:db) do
        execute "cd #{release_path}; HIPPO_ENV=production bundle exec rake assets:precompile"
    end
end

after 'bundler:install', :yarn
after :yarn, :assets
after :assets, :migrate
