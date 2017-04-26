set :application, 'stockor-saas'
set :repo_url, 'https://github.com/argosity/sm.git'
set :deploy_to, '/srv/www/showmaker.com'
set :passenger_restart_with_touch, true
set :conditionally_migrate, true
set :linked_files, %w(config/database.yml)
set :linked_dirs ,  %w(public/files log)
set :passenger_restart_with_touch, false

set :rollbar_env, Proc.new { fetch :stage }
set :rollbar_role, Proc.new { :app }


task :migrate do
    on roles(:db) do
        execute "cd #{release_path}; LANES_ENV=production bundle exec lanes db migrate"
        execute "cd #{release_path}; LANES_ENV=production bundle exec lanes db seed"
    end
end

task :yarn do
    on roles(:web) do
        execute "cd #{release_path}; yarn install"
    end
end

after 'bundler:install', :yarn
after :yarn, :migrate
