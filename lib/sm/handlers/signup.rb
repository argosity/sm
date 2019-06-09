module SM::Handlers

    module Signup

        def self.handler
            lambda do

                # tenant = Hippo::Tenant.new(params.slice(:email))
                # Hippo::Tenant.transaction do
                #     tenant.name = params['company']
                #     tenant.perform do
                #         user = tenant.users.build(params.slice(:name, :email, :login, :password)
                #                                .merge(role_names: ["administrator"]))
                #         if tenant.save
                #             # Hippo::Tenant.system.perform do
                #             #   SM::Templates::Signup.create(tenant, user).deliver
                #             # end
                #         end
                #     end
                # end
                # if tenant.errors.any?
                #     erb :signup, locals: { tenant: tenant }
                # else
                #     tenant.perform do
                #         erb :signup_success, locals: { tenant: tenant }
                #     end
                # end
            end
        end
    end
end
