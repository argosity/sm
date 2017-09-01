module SM
    class Embed < Model
        belongs_to_tenant
        has_random_identifier

        def self.json_for(identifier)
            res = connection.select_all(
                "select * from public_events where embed_identifier = #{connection.quote(identifier)}"
            )
            res.to_a.map { |r| r.each { |k, v| r[k] = res.column_types[k].deserialize(v) } }
        end

        def self.update_tenant_slugs(old_slug, new_slug)
            where(["tenants && ARRAY[:slug]", { slug: old_slug }])
                .update_all(["tenants = array_replace(tenants, :old_slug, :new_slug)",
                        { old_slug: old_slug, new_slug: new_slug }])
        end

    end
end

Hippo::Tenant.observe(:update) do |tenant|
    chg = tenant.saved_change_to_attribute('slug')
    SM::Embed.update_tenant_slugs(chg.first, chg.last) if chg
end

Hippo::Tenant.observe(:create) do |tenant|
    SM::Embed.create(name: 'My events', tenant: tenant, tenants: [tenant.slug])
end
