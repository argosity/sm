require_relative '../spec_helper'

describe SM::Tenant do
    let(:tenant) { FactoryGirl.create :tenant  }

    it "updates embed slugs when it's slug is changed" do
        expect(SM::Embed).to recieve(:update_tenant_slugs).with([tenant.slug, 'foo'])
        tenant.udpate_attributes(slug: 'foo')
    end
end
