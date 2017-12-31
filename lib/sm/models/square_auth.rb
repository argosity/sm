require 'net/http'
require 'net/https'
require_relative '../../sm'

module SM

    class SquareAuth < Model

        belongs_to_tenant

        validates :token, :merchant_id, :expires_at, presence: true
        after_create :request_webhooks

        def in_use?
            !new_record? && SM::Payments.vendor_id == :square
        end

        def request_webhooks
            token = Hippo.config.secrets.dig('payments', 'square', 'token')
            SM::Payments::Square::Request.new(
                type: 'put',
                url: "v1/#{location_id}/webhooks",
                body: SM::Payments::Square::WEBHOOKS,
                secret: "Bearer #{token}"
            )
        end


        def variation_for_show_time(st)
            square = st.config['square'] ||= {}
            id = square['id'] || "##{st.date_identifier}"
            version = square['version']

            return {
                id: id,
                type: "ITEM_VARIATION",
                present_at_all_locations: false,
                present_at_location_ids: [location_id],
                version: version,
                item_variation_data: {
                    name: id,
                    sku: st.date_identifier,
                    pricing_type: 'FIXED_PRICING',
                    price_money: {
                        currency: 'USD',
                        amount: (st.price * 100).to_i
                    }
                }
            }
        end

        def upsert_item_for_show(show)
            return unless show.can_purchase?
            ca = SquareConnect::CatalogApi.new(
                SM::Payments::Square.api_client
            )
            square = show.config['square'] ||= {}
            id = square['id'] || "##{show.identifier}"
            version = square['version']
            info = {
                idempotency_key: rand.to_s,
                object: {
                    id: id,
                    type: 'ITEM',
                    present_at_all_locations: false,
                    version: version,
                    present_at_location_ids: [location_id],
                    item_data: {
                        name: show.title,
                        description: show.description,
                        abbreviation: Hippo::Strings.code_identifier(show.title),
                        variations: show.times.map{|st|
                            variation_for_show_time(st)
                        }
                    }
                }
            }
            reply = ca.upsert_catalog_object_with_http_info(info).first
            square['id'] = reply.catalog_object.id
            square['version'] = reply.catalog_object.version
            reply.catalog_object.item_data.variations.each_with_index do |iv, i|
                config = show.times[i].config['square']
                config['id'] = iv.id
                config['version'] = iv.version
            end
            return reply
        end

        def renew
            settings = SM::Payments::Square.system_settings_values

            req = SM::Payments::Square::Request.new(
                url: "oauth2/clients/#{settings.application_id}/access-token/renew",
                body: { access_token: token }
            )
            if req.ok?
                update_attributes!(
                    token: req.reply.access_token,
                    expires_at: req.reply.expires_at,
                    merchant_id: req.reply.merchant_id)
            else
                Hippo.logger.warn "Token renewal failed for #{tenant.slug}"
            end
        end


        ## Class methods

        def self.obtain(tenant, code)
            settings = SM::Payments::Square.system_settings_values
            req = SM::Payments::Square::Request.new(
                url: 'oauth2/token',
                body: {
                    client_id: settings.application_id,
                    client_secret: settings.secret,
                    code: code,
                    redirect_uri: settings.redirect_uri,
                },
                secret: false
            )
            if req.ok?
                sqa = SquareAuth.find_or_initialize_by(tenant: tenant)
                sqa.update_attributes!(
                    token: req.reply.access_token,
                    expires_at: req.reply.expires_at,
                    merchant_id: req.reply.merchant_id
                )
                return sqa
            else
                nil
            end
        end

        def self.refresh
            SquareAuth
                .where("expires_at + interval '2 days' > now()")
                .find_each{|auth| auth.renew }
        end

    end

end

SM::Show.observe(:save) do |show|
    auth = SM::SquareAuth.where(tenant: show.tenant).first
    begin
        auth.upsert_item_for_show(show) if auth && auth.in_use?
    rescue SquareConnect::ApiError => e
        Hippo.logger.warn e
        Rollbar.error(e)
    end
end

Hippo::Cron.daily do
    SM::SquareAuth.where('expires_at < ?', 3.days.from_now).each(&:renew)
end
