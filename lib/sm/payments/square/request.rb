require 'uri'
require 'net/http'
require 'net/https'

module SM
    module Payments
        module Square

            class Request
                def initialize(
                        url:,
                        body:,
                        type: 'post',
                        secret: "Client #{Hippo.config.secrets.payments.square.secret}"
                    )

                    uri = URI.parse("https://connect.squareup.com/#{url}")
                    https = Net::HTTP.new(uri.host, uri.port)
                    https.use_ssl = true
                    headers = {
                        'Accept' => 'application/json',
                        'Content-Type' =>'application/json'
                    }
                    if secret
                        headers['Authorization'] = secret
                    end
                    req = Net::HTTP.const_get(type.capitalize).new(
                        uri.path, headers
                    )
                    req.body = body.to_json
                    @response = https.request(req)
                    unless ok?
                        Hippo.logger.warn "Request to #{url} failed #{@response.code} #{@response.message}: #{@response.body}"
                    end
                end

                def ok?
                    @response.code == '200'
                end

                def reply
                    @reply ||=  OpenStruct.new(JSON.parse(@response.body))
                end
            end
        end
    end
end
