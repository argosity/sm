source 'https://rubygems.org'

# For development while Lanes is evolving track master branch
gem "lanes", git: "https://github.com/argosity/lanes", branch: 'master'

gem "activerecord-multi-tenant", git: "https://github.com/nathanstitt/activerecord-multi-tenant", branch: 'fix/rails-version'
gem 'shrine-memory'
# gem "lanes", '0.8.3'
gem 'friendly_id', '~> 5.1.0'
group :test, :development do
    gem 'factory_girl'
    gem 'faker'
    gem 'vcr', '~> 3.0'
    gem 'webmock', '~> 3.0'
    gem 'database_cleaner'
end
gem 'rake'
gem 'puma'
gem "braintree", "~> 2.73"
