require 'square_connect'
require 'oauth2'
require 'uri'

module SM
    module Payments
        module Square
            extend self
            CONFIG_KEY='square'
            SCOPES = 'MERCHANT_PROFILE_READ ITEMS_READ ITEMS_WRITE PAYMENTS_READ PAYMENTS_WRITE'

            def authorization_url
                client.auth_code.authorize_url(
                    redirect_uri: system_settings_values['redirect_url'],
                    scope: SCOPES
                )
            end

            def payment_authorization
                system_settings_values['application_id']
            end

            def client
                @oauth_client ||= OAuth2::Client.new(
                    system_settings_values['application_id'],
                    system_settings_values['secret'], {
                        site: 'https://connect.squareup.com',
                        redirect_uri: system_settings_values['redirect_url'],
                        authorize_url: "/oauth2/authorize",
                        token_url: "/oauth2/token",
                    })
            end

            def sale(payment)
                sale = payment.sale
                SquareConnect::TransactionsApi.new(config)
#               amount = PRODUCT_COST[params[:product_id]]
                request_body = {
                    card_nonce: payment.nonce,
                    reference_id: sale.identifier,
                    amount_money: {
                        :amount => (payment.amount * 100).to_i,
                        :currency => 'USD'
                    },
                    :idempotency_key => sale.identifier,
                    buyer_email_address: sale.email,
                }

                begin
                    api = SquareConnect::TransactionsApi.new(api_client)
                    result = api.charge(
                        client_config_values['location_id'],
                        request_body
                    )
                    success = result.errors.blank?
                    message = success ? Payments::SUCCESS_MSG : result.errors.map(&:detail).join(', ')
                    return ChargeResult.new(
                        success: success,
                        transaction: result.transaction.id,
                        message: message
                    )
                rescue SquareConnect::ApiError => e
                    error = JSON.parse(e.response_body)['errors'].first
                    return ChargeResult.new(
                               success: false,
                               message: error['detail'],
                               transaction: error['code']
                           )
                end
            end

            def authorize(params, request)
                uri = URI.parse(request.url)
                uri.path = '/oauth2callback'
                uri.query = nil

                reply = client.auth_code.get_token(params['code'])

                api = SquareConnect::ApiClient.new(make_config(reply.token))

                locations_api = SquareConnect::LocationsApi.new(api)
                # TODO remember the expiration, we'll need to renew every 30 days
                { token: reply.token, locations: locations_api.list_locations.locations }
            end

            def system_settings_values
                Hippo.config.secrets['payments']['square']
            end

            def client_config_values
                Hippo::SystemSettings.config.settings['square']
            end

            def config
                make_config(client_config_values['authorization'])
            end

            def make_config(access_token)
                config = SquareConnect::Configuration.new
                config.access_token = access_token
                config.logger=Hippo.logger
                config
            end

            def api_client
                SquareConnect::ApiClient.new(config)
            end


        end
    end
end
