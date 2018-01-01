require_relative '../spec_helper'
require 'sm/models/embed'

describe "Tenant signup", api: true, vcr: VCR_OPTS do

    around(:each) { |ex|
        RSpec::Mocks.with_temporary_scope do
            with_bt_payment_proccessor { ex.run }
        end
    }

    it "displays an error message for tenant" do
        expect {
            post '/signup', { name: 'Bob', company: 'My CO', password: 'test' }
        }.to change { Hippo::Tenant.count }.by(0)
        expect(last_response).to be_ok
        expect(last_response.body).to include("Email can't be blank")
        expect(last_response.body).to include("password is too short")
    end

    it "displays an error message for invalid user params" do
        expect {
            post '/signup', { name: 'Bobe', company: 'My CO', email: 'bob3@test.com', password: 'short' }
        }.to change { Hippo::Tenant.count }.by(0)
        expect(last_response).to be_ok
        expect(last_response.body).to include("password is too short")
    end

    it "succeeds when required data is present" do
        3.times do |i|
            expect do
                post '/signup', {
                         name: 'Bob',
                         company: "co-#{i}",
                         email: 'test@test.com',
                         login: 'admin',
                         password: 'password123'
                     }
                expect(last_response).to be_ok
            end.to change { Hippo::Tenant.count }.by(1)
        end
        tenant = Hippo::Tenant.where(slug: 'co2xx').first
        tenant.perform do
            expect(tenant.users.count).to eq(1)
            expect(last_response.body).to include(tenant.url)
            email = Mail::TestMailer.deliveries.last
            expect(email).not_to be_nil
            expect(email.subject).to include("ShowMaker")
            expect(email.body).to include(tenant.url)
            expect(email.to).to eq([tenant.email])
            expect(email.body).to include(tenant.users.first.login)
        end
    end

    it 'creates a single embed' do
        post '/signup', { name: 'Bob', company: "My Place Is Awesome",
                          email: 'test@test.com', login: 'admin', password: 'password123' }
        Hippo::Tenant.last.perform do
            expect(SM::Embed.count).to eq(1)
            t = Hippo::Tenant.current
            t.slug = 'AbaCa'
            t.save!
            expect(t.embeds.last.tenants).to eq(['abaca'])
        end
    end
end
