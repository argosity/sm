source 'https://rubygems.org'

# For development while Lanes is evolving track master branch
gem "lanes", git: "https://github.com/argosity/lanes", branch: 'master'

gem "activerecord-multi-tenant", git: "https://github.com/nathanstitt/activerecord-multi-tenant", branch: 'fix/rails-version'
gem 'shrine-memory'
# gem "lanes", '0.8.3'

group :test, :development do
    gem 'factory_girl'
    gem 'faker'
    gem 'vcr', '~> 3.0'
    gem 'webmock', '~> 3.0'
    gem 'database_cleaner'
    gem 'capistrano', '~> 3.8'
    gem 'capistrano-bundler', '~> 1.2'
    gem 'capistrano-rails', '~> 1.2'
    gem 'capistrano-passenger', '~> 0.2'

end
gem 'rollbar'
gem 'puma'
gem 'rake'
gem "braintree", "~> 2.73"
