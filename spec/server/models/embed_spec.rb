require_relative '../spec_helper'

describe SM::Embed do

    let(:events) { 3.times.map{
                        FactoryGirl.create :event,
                        visible_during: (3.days.ago...3.days.from_now)
                    } }
    let(:embeds) {
        3.times.map{ FactoryGirl.create(
                         :embed,
                         tenants: (
                             (rand*3+1).to_i.times.map{ Faker::Color.color_name } +
                             [ Hippo::Tenant.current.slug ]
                         )
                     )
        }
    }

    it "updates event slugs" do
        slugs = embeds.map(&:tenants)
        old_slug = slugs[0][0]
        SM::Embed.update_tenant_slugs(old_slug, 'YELLOW')
        SM::Embed.pluck(:tenants).each do |slugs|
            expect(slugs).to_not include(old_slug)
        end
    end

    it "a default is created along with tenant" do
        tenant = FactoryGirl.create :tenant
        expect(SM::Embed.where(tenant: tenant, name: 'default').any?).to be(true)
    end

    it "can query events" do
        visible_event = events.find{|ev| ev.occurrences.find{|oc| oc.occurs_at > Time.now } }
        if visible_event.present?
            json = SM::Embed.json_for(embeds.first.identifier)
            ids = json.map { |e| e['identifier'] }
            expect(ids).to include(visible_event.identifier)
        end
    end
end
