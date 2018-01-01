require_relative '../spec_helper'

describe SM::Embed, api: true, vcr: VCR_OPTS do

    let(:shows) { 3.times.map{
                        FactoryBot.create :show,
                        visible_during: (3.days.ago...3.days.from_now)
                    } }
    let(:embeds) {
        3.times.map{ FactoryBot.create(
                         :embed,
                         tenants: (
                             (rand*3+1).to_i.times.map{ Faker::Color.color_name } +
                             [ Hippo::Tenant.current.slug ]
                         )
                     )
        }
    }

    it "updates show slugs" do
        slugs = embeds.map(&:tenants)
        old_slug = slugs[0][0]
        SM::Embed.update_tenant_slugs(old_slug, 'YELLOW')
        SM::Embed.pluck(:tenants).each do |slugs|
            expect(slugs).to_not include(old_slug)
        end
    end

    it "a default is created along with tenant" do
        with_bt_payment_proccessor do
            tenant = FactoryBot.create :tenant
            expect(SM::Embed.where(tenant: tenant, name: 'My Shows').any?).to be(true)
        end
    end

    it "can query shows" do
        visible_show = shows.find{|s| s.times.find{|st| st.occurs_at > Time.now } }
        if visible_show.present?
            json = SM::Embed.json_for(embeds.first.identifier)
            ids = json.map { |e| e['identifier'] }
            expect(ids).to include(visible_show.identifier)
        end
    end
end
