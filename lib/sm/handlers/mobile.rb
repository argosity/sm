module SM::Handlers

    module Mobile

        def self.handler
            @handler ||= lambda do
                if request.post?
                    tenant = Hippo::Tenant.where(slug: params[:identifier]).first
                    redirect "https://#{tenant.domain}" if tenant
                end
                erb :mobile
            end
        end

    end
end
