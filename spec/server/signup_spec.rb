require_relative './spec_helper'

describe "Tenant signup", api: true, vcr: VCR_OPTS do

    it "displays an error message for tenant" do
        expect {
            post '/signup', { name: 'Bob', company: 'My CO', password: 'test' }
        }.to change { SM::Tenant.count }.by(0)
        expect(last_response).to be_ok
        expect(last_response.body).to include("Email can't be blank")
        expect(last_response.body).to include("password is too short")
    end

    it "displays an error message for invalid user params" do
        expect {
            post '/signup', { name: 'Bobe', company: 'My CO', email: 'bob3@test.com', password: 'short' }
        }.to change { SM::Tenant.count }.by(0)
        expect(last_response).to be_ok
        expect(last_response.body).to include("password is too short")
    end

    it "succeeds when required data is present" do
        3.times do |i|
            p i
            expect do
                post '/signup', {
                         name: 'Bob',
                         company: "co-#{i}",
                         email: 'test@test.com',
                         login: 'admin',
                         password: 'password123'
                     }
                expect(last_response).to be_ok
            end.to change { SM::Tenant.count }.by(1)

        end
        tenant = SM::Tenant.where(slug: 'co2xx').first
        MultiTenant.with(tenant) do
            expect(tenant.users.count).to eq(1)
            expect(last_response.body).to include(tenant.url)
            email = Mail::TestMailer.deliveries.last
            expect(email.subject).to include("ShowMaker")
            expect(email.body).to include(tenant.url)
            expect(email.to).to eq([tenant.email])
            expect(email.body).to include(tenant.users.first.login)
        end
    end

end
