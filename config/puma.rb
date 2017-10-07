require 'dotenv/load'

if ENV['SSL_CERT_PATH'] && ENV['SSL_KEY_PATH']
    ssl_bind(
        ENV['HOST'] || 'localhost',
        ENV['PORT'] || '9292', {
            key: ENV["SSL_KEY_PATH"],
            cert: ENV["SSL_CERT_PATH"],
            verify_mode: 'none'
        }
    )
end
