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
  ev.price,
  ev.capacity,
  show_occurrences.first_occurrence,
  coalesce(show_occurrences.occurrences, '[]'::json) as occurrences,
  json_build_object(
    'file_data', show_asset.file_data
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
  join shows ev on ev.tenant_id = tenant.id
  left join (
    select
      evo.show_id,
      min(evo.occurs_at) first_occurrence,
      json_agg((select x from (
          select
              evo.identifier
              ,evo.occurs_at at time zone 'UTC' as occurs_at
              ,evo.price
              ,evo.capacity
      ) x) order by evo.occurs_at) AS occurrences
    from occurrences evo where evo.occurs_at > now() group by evo.show_id
  ) show_occurrences on show_occurrences.show_id = ev.id
  left join venues on venues.id = ev.venue_id
  left join presenters presenter on presenter.id = ev.presenter_id
  left join assets as show_asset on show_asset.owner_type = 'SM::Show'
       and show_asset.owner_id = ev.id
  left join assets as presenter_asset on presenter_asset.owner_type = 'SM::Presenter'
       and presenter_asset.owner_id = presenter.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
