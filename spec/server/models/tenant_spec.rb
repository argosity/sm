require_relative '../spec_helper'

describe Hippo::Tenant do
    let(:tenant) { FactoryGirl.create :tenant  }

    it "updates embed slugs when it's slug is changed" do
        expect(SM::Embed).to receive(:update_tenant_slugs).with(tenant.slug, 'foo')
        tenant.update_attributes(slug: 'foo')
    end


    it 'sends an email for signup' do
        user = tenant.users.create({ login: 'test' })
        expect {
            SM::Templates::Signup.create(tenant, user).deliver
        }.to change { Mail::TestMailer.deliveries.length }.by(1)
    end

end
