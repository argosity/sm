select
  em.identifier as embed_identifier,
  tenant.slug as tenant_slug,
  ev.identifier,
  ev.title,
  ev.sub_title,
  ev.description,
  ev.external_url,
  ev.can_purchase,
  ev.page,
  ev.visible_during,

  event_occurrences.occurrences,

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
      'logo', json_build_object(
         'file_data', presenter_asset.file_data
       )
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
  join events ev on ev.tenant_id = tenant.id -- and now()::timestamp <@ visible_during
  left join (
    select
      evo.event_id,
      json_agg((select x from (select evo.identifier, evo.occurs_at, evo.price, evo.capacity) x) order by evo.occurs_at) AS occurrences
    from event_occurrences evo group by evo.event_id
  ) event_occurrences on event_occurrences.event_id = ev.id
  left join venues on venues.id = ev.venue_id
  left join presenters presenter on presenter.id = ev.presenter_id
  left join assets as event_asset on event_asset.owner_type = 'SM::Event'
       and event_asset.owner_id = ev.id
  left join assets as presenter_asset on presenter_asset.owner_type = 'SM::Presenter'
       and presenter_asset.owner_id = presenter.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
