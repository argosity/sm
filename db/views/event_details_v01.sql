select
  ev.id as event_id,
  json_build_object(
    'id', event_asset.id,
    'file_data', event_asset.file_data
  ) as image_details,
  json_build_object(
    'id', venues.id,
    'name', venues.name,
    'address', venues.address,
    'phone_number', venues.phone_number,
    'logo', venue_asset.file_data
  ) as venue_details
from events ev
  left join venues on venues.id = ev.venue_id
  left join assets as event_asset on event_asset.owner_type = 'SM::Event'
       and event_asset.owner_id = ev.id
  left join assets as venue_asset on venue_asset.owner_type = 'SM::Venue'
       and venue_asset.owner_id = ev.venue_id
