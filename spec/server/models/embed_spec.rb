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

    # it "can query events" do
    #     titles = events.map(&:title)
    #     expect(SM::Embed.json_for('f')).to(
    #         include(a_collection_including(
    #                     'title' => titles[0]
    #                 )
    #                )
    #     )
    # end

    it "updates event slugs" do
        slugs = embeds.map(&:tenants)
        p slugs
        MultiTenant.with(tenant) do
            SM::Embed.update_tenant_slugs(slugs[0][0], 'YELLOW')
            p SM::Embed.pluck(:tenants)
        end
    end

end
