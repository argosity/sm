source 'https://rubygems.org'

# For development while Hippo is evolving track master branch
gem "hippo-fw", git: "https://github.com/argosity/hippo", branch: 'master'

# gem "webpack_driver", git: "https://github.com/nathanstitt/webpack_driver", branch: 'master'

gem "activerecord-multi-tenant", git: 'https://github.com/citusdata/activerecord-multi-tenant.git', branch: 'release-0.5.1'
# gem "activerecord-multi-tenant", git: "https://github.com/nathanstitt/activerecord-multi-tenant", branch: 'fix/rails-version' # query_rewriter'
# gem 'shrine-memory'
# gem "hippo", '0.8.3'

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
