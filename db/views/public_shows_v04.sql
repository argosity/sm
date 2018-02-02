select
  em.identifier as embed_identifier,
  tenant.slug as tenant_slug,
  sh.identifier,
  sh.title,
  sh.sub_title,
  sh.description,
  sh.external_url,
  sh.can_purchase,
  sh.page,
  sh.visible_during,
  sh.price,
  sh.capacity,
  sh.online_sales_halt_mins_before,
  times_info.first_show_time,
  coalesce(times_info.show_times, '[]'::json) as times,
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
    'logo', json_build_object('file_data', venue_asset.file_data),
    'timezone', venues.timezone
  ) as venue

from embeds em
  join tenants tenant on tenant.slug in (select unnest(em.tenants))
  join shows sh on sh.tenant_id = tenant.id
  left join (
    select
      st.show_id,
      min(st.occurs_at) first_show_time,
      json_agg((select x from (
          select
              st.identifier
              ,st.occurs_at at time zone 'UTC' as occurs_at
              ,st.price
              ,st.capacity
      ) x) order by st.occurs_at) AS show_times
    from show_times st where st.occurs_at > now() group by st.show_id
  ) times_info on times_info.show_id = sh.id
  left join venues on venues.id = sh.venue_id
  left join presenters presenter on presenter.id = sh.presenter_id
  left join assets as show_asset on show_asset.owner_type = 'SM::Show'
       and show_asset.owner_id = sh.id
  left join assets as presenter_asset on presenter_asset.owner_type = 'SM::Presenter'
       and presenter_asset.owner_id = presenter.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = sh.venue_id
