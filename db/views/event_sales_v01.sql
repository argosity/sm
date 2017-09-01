select
  pur.id as purchase_id,
  evo.event_id as event_id,
  evo.id as event_occurrence_id,
  pur.identifier as purchase_identifier,
  pur.name,
  pur.phone,
  pur.email,
  pur.qty,
  pur.created_at,
  coalesce(redemptions.redemptions, '[]'::json) as redemptions
from event_occurrences evo
  join purchases pur on pur.occurrence_id = evo.id
  left join (
    select
      rd.purchase_id,
      json_agg((select x from (
          select rd.qty, rd.created_at at time zone 'UTC' as created_at
      ) x)) AS redemptions
    from redemptions rd group by rd.purchase_id
  ) redemptions on redemptions.purchase_id = pur.id
