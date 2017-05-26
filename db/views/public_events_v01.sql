select
  em.identifier as embed_identifier,
  tenant.slug as tenant_slug,
  ev.identifier,
  ev.title,
  ev.sub_title,
  ev.description,
  ev.external_url,
  ev.page_html,
  ev.occurs_at,
  ev.onsale_after,
  ev.onsale_until,
  ev.price,
  ev.capacity,

  json_build_object(
    'file_data', event_asset.file_data
  ) as image,

  case
  when presenter IS NULL then null
  else
        json_build_object(
          'name', presenter.name,
          'logo', presenter_asset.file_data
         )
  END as presenter,

  json_build_object(
    'name', venues.name,
    'address', venues.address,
    'phone_number', venues.phone_number,
    'logo', venue_asset.file_data
  ) as venue

from embeds em

  join tenants tenant on tenant.slug in (select unnest(em.tenants))

  join events ev on ev.tenant_id = tenant.id
      and ev.visible_after <= now() and ev.visible_until >= now()

  left join venues on venues.id = ev.venue_id
  left join presenters presenter on presenter.id = ev.presenter_id

  left join assets as event_asset on event_asset.owner_type = 'SM::Event'
       and event_asset.owner_id = ev.id

  left join assets as presenter_asset on presenter_asset.owner_type = 'SM::Presenter'
       and presenter_asset.owner_id = presenter.id

  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
