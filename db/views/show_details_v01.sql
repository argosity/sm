select
  ev.id as show_id,
  show_occurrences.occurrences,
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
      evo.show_id,
      json_agg((select x from (
          select
              evo.id
              ,evo.identifier
              ,evo.occurs_at at time zone 'UTC' as occurs_at
              ,evo.price
              ,evo.capacity
      ) x)) AS occurrences
    from occurrences evo group by evo.show_id
  ) show_occurrences on show_occurrences.show_id = ev.id
  left join assets as show_asset on show_asset.owner_type = 'SM::Show'
       and show_asset.owner_id = ev.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
