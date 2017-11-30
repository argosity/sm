require_relative 'square/request';
require 'square_connect'
require 'oauth2'
require 'uri'

module SM
    module Payments
        module Square

            extend self
            CONFIG_KEY='square'
            SCOPES = 'MERCHANT_PROFILE_READ ITEMS_READ ITEMS_WRITE PAYMENTS_READ PAYMENTS_WRITE CUSTOMERS_WRITE ORDERS_WRITE'
            WEBHOOKS = 'PAYMENT_UPDATED', 'INVENTORY_UPDATED'

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
                        redirect_uri: system_settings_values['redirect_uri'],
                        authorize_url: "/oauth2/authorize",
                        token_url: "/oauth2/token",
                    })
            end

            def create_order_for_sale(sale)
                item_config = sale.show_time.config['square']
                return false unless item_config && item_config['id']

                begin
                    api = SquareConnect::OrdersApi.new(api_client)
                    result = api.create_order(
                        client_config_values['location_id'], {
                            idempotency_key: sale.identifier,
                            line_items: [
                                { quantity: sale.qty.to_s, catalog_object_id: item_config['id'] }
                            ]
                        }
                    )
                    return result.order
                rescue SquareConnect::ApiError => e
                    Hippo.logger.warn "Failed to create order for sale: #{e.response_body}"
                    return false
                end
            end

            def transactions_api
                SquareConnect::TransactionsApi.new(api_client)
            end

            def sale(payment)
                sale = payment.sale

                request_body = {
                    idempotency_key: sale.identifier,
                    card_nonce: payment.nonce,
                    reference_id: sale.identifier,
                    amount_money: {
                        :amount => (payment.amount * 100).to_i,
                        :currency => 'USD'
                    },
                    buyer_email_address: sale.attendee.email
                }
                order = create_order_for_sale(sale)
                request_body[:order_id] = order.id if order

                customer_id = sale.attendee.square_customer_id
                request_body[:customer_id] = customer_id unless sale.attendee.square_customer_id.blank?

                begin
                    api = transactions_api
                    result = api.charge(
                        client_config_values['location_id'],
                        request_body
                    )
                    success = result.errors.blank?
                    if success
                        payment.processor_id = :square
                        payment.processor_transaction = result.transaction.id
                        payment.metadata['tender_id'] = result.tenders.first.id
                    end
                    return ChargeResult.new(
                               success: success,
                               message: success ? Payments::SUCCESS_MSG :
                                   result.errors.map(&:detail).join(', ')
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
                tenant = Hippo::Tenant.find_by_slug!(params['state'])
                failure_url = "https://#{tenant.domain}/sq/relay-auth?token=failed&failed=true"
                return failure_url unless params['code']
                begin
                    auth = SM::SquareAuth.obtain(tenant, params['code'])
                    if auth
                        api = SquareConnect::ApiClient.new(
                            make_config(auth.token)
                        )
                        locations_api = SquareConnect::LocationsApi.new(api)
                        locations = locations_api.list_locations.locations.map do |l|
                            {id: l.id, name: l.name}
                        end
                        info = {
                            token: auth.token, locations: locations
                        }.to_param
                        "https://#{tenant.domain}/sq/relay-auth?#{info}"
                    else
                        failure_url
                    end
                rescue => e
                    Hippo.logger.warn "Failed to authorize square merchant: #{e}"
                    failure_url
                end
            end

            def system_settings_values
                Hippo.config.secrets.dig('payments', 'square') || {}
            end

            def client_config_values
                SM::SquareAuth.where(tenant: Hippo::Tenant.current).first
            end

            def config
                make_config(client_config_values['token'])
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

            def refund(payment, reason)
                api = transactions_api
                trn = api.create_refund(
                    client_config_values['location_id'],
                    payment.processor_transaction, {
                        reason: reason,
                        idempotency_key: payment.processor_transaction,
                        tender_id: payment.metadata['tender_id'],
                        amount_money:  {
                            amount: (payment.amount * 100).to_i,
                            currency: 'USD'
                        }
                    }
                )
                success = ['PENDING', 'APPROVED'].include?(trn.refund.status)
                if success
                    payment.update_attributes!(
                        refund_id: trn.refund.id
                    )
                end
                return success
            end

            def set_payment_tenders
                SM::Payment.all.each do |pmt|
                    pmt.processor_id = :square
                    begin
                        trn = transactions_api.retrieve_transaction(
                            client_config_values['location_id'],
                            pmt.processor_transaction
                        )
                        pmt.metadata['tender_id'] = trn.transaction.tenders.first.id
                        p pmt
                        pmt.save!
                    rescue => e
                        p e
                    end
                end
            end

        end
    end
end
