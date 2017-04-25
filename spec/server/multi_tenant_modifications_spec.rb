require_relative 'spec_helper'

describe "Multi tenant hacks" do
    it "adds validations to user" do
        tenant1 = SM::Tenant.find_or_create_by(slug: 'test1', name: 'testing tenant')
        tenant2 = SM::Tenant.find_or_create_by(slug: 'test2', name: 'testing tenant')

        user1 = FactoryGirl.create :user, login: 'bob', email: 'bob@test.com', tenant: tenant1
        user2 = FactoryGirl.create :user, login: 'bob', email: 'bob@test.com', tenant: tenant2
        expect(user1.new_record?).to eq(false)
        expect(user2.new_record?).to eq(false)
        expect(user1.email).to eq(user2.email)
        expect(user1.login).to eq(user2.login)
    end

    it 'loads system settings for multiple tenants' do
        tenant1 = SM::Tenant.find_or_create_by(slug: 'test1', name: 'testing tenant')
        MultiTenant.with(tenant1) do
            config = Lanes::SystemSettings.config
            expect(config.id).to eq(1)
            ext = Lanes::SystemSettings.for_ext('foo')
            ext.fingerprint = 'one'
            ext.persist!
        end
        tenant2 = SM::Tenant.find_or_create_by(slug: 'test2', name: 'testing tenant')
        MultiTenant.with(tenant2) do
            config = Lanes::SystemSettings.config
            expect(config.id).to eq(1)
            ext = Lanes::SystemSettings.for_ext('foo')
            expect(ext.fingerprint).to be_nil
        end
    end
end
