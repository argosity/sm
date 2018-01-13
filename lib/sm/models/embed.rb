module SM
    class Embed < Model
        belongs_to_tenant
        has_random_identifier

        def self.current_shows(identifier)
            res = connection.select_all(
                "select * from public_shows where embed_identifier = #{connection.quote(identifier)} and visible_during @> now()::timestamp order by first_show_time"
            )

            res.to_a.map do |r|
                r.each { |k, v| r[k] = res.column_types[k].deserialize(v) }
                SM::Models::ShowWrapper.new(r)
            end

        end

        def self.update_tenant_slugs(old_slug, new_slug)
            where(["tenants && ARRAY[:slug]", { slug: old_slug }])
                .update_all(["tenants = array_replace(tenants, :old_slug, :new_slug)",
                        { old_slug: old_slug, new_slug: new_slug }])
        end

    end
end

Hippo::Tenant.has_many :embeds, class_name: 'SM::Embed'

Hippo::Tenant.observe(:update) do |tenant|
    chg = tenant.attribute_change_to_be_saved('slug')
    SM::Embed.update_tenant_slugs(chg.first, chg.last) if chg
end

Hippo::Tenant.observe(:create) do |tenant|
    tenant.embeds.build(name: 'My Shows', tenant: tenant, tenants: [tenant.slug])
end
