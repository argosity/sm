require_relative '../spec_helper'

describe SM::Embed do
    let!(:tenant) { FactoryGirl.create :tenant  }
    let!(:events) { 3.times.map{
                        FactoryGirl.create :event, tenant: tenant,
                        visible_after: 3.days.ago,
                        visible_until: 3.days.from_now
                    } }
    let!(:embeds) {
        3.times.map{ FactoryGirl.create(
                         :embed,
                         tenants: (
                             (rand*3+1).to_i.times.map{ Faker::Color.color_name } +
                             [ tenant.slug ]
                         ),
                         tenant: tenant)
        }
    }

    it "updates event slugs" do
        slugs = embeds.map(&:tenants)
        tenant.perform do
            old_slug = slugs[0][0]
            SM::Embed.update_tenant_slugs(old_slug, 'YELLOW')
            SM::Embed.pluck(:tenants).each do | slugs |
                expect(slugs).to_not include(old_slug)
            end
        end
    end

    it "updates embed slugs when tenant is updated" do
        tenant.perform do
            expect(SM::Embed).to receive(:update_tenant_slugs).with(tenant.slug, 'foo')
            tenant.update_attributes(slug: 'foo')
        end
    end

    it "can query events" do
        tenant.perform do
            event_identifier = events.first.identifier
            json = SM::Embed.json_for(embeds.first.identifier)
            expect(json.map { |e| e['identifier'] }).to include(event_identifier)
        end
    end
end
