require_relative '../spec_helper'

describe SM::Embed do
    let(:tenant) { FactoryGirl.create :tenant  }
    let(:events) { 3.times.map{ FactoryGirl.create :event, tenant: tenant } }
    let(:embeds) {
        3.times.map{ FactoryGirl.create(
                         :embed,
                         tenants: (rand*3+1).to_i.times.map{ Faker::Color.color_name },
                         tenant: tenant)
        }
    }

    it "updates event slugs" do
        slugs = embeds.map(&:tenants)
        MultiTenant.with(tenant) do
            old_slug = slugs[0][0]
            SM::Embed.update_tenant_slugs(old_slug, 'YELLOW')
            SM::Embed.pluck(:tenants).each do | slugs |
                expect(slugs).to_not include(old_slug)
            end
        end
    end

end
