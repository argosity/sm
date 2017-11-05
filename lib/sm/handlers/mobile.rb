module SM::Handlers

    module Mobile

        def self.handler
            @handler ||= lambda do
                if request.post?
                    tenant = Hippo::Tenant.where(slug: 'dev').first
                    redirect "https://#{tenant.domain}" if tenant
                end
                erb :choose
            end
        end

    end
end
