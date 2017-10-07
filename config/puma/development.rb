bang()
ssl_bind 'dev.argosity.com', '9292', {
             key: ENV["SSL_KEY_PATH"] || "#{ENV['HOME']}/.ssl/dev.argosity.com.key",
             cert: ENV["SSL_CERT_PATH"] || "#{ENV['HOME']}/.ssl/dev.argosity.com.crt",
             verify_mode: 'none'
         }
