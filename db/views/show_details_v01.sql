select
  ev.id as show_id,
  show_times.show_times,
  json_build_object(
    'id', show_asset.id,
    'file_data', show_asset.file_data
  ) as image_details,
  json_build_object(
    'id', venues.id,
    'name', venues.name,
    'address', venues.address,
    'phone_number', venues.phone_number,
    'logo', venue_asset.file_data
  ) as venue_details
from shows ev
  left join venues on venues.id = ev.venue_id
  left join (
    select
      st.show_id,
      json_agg((select x from (
          select
              st.id
              ,st.identifier
              ,st.occurs_at at time zone 'UTC' as occurs_at
              ,st.price
              ,st.capacity
      ) x)) AS show_times
    from show_times st group by st.show_id
  ) show_times on show_times.show_id = ev.id
  left join assets as show_asset on show_asset.owner_type = 'SM::Show'
       and show_asset.owner_id = ev.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
