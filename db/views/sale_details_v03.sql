select
  sales.id as sale_id,
  coalesce((
    select
      json_agg((select x from (
          select rd.qty, rd.created_at at time zone 'UTC' as created_at
      ) x)) AS redemptions
    from redemptions rd where rd.sale_id = sales.id group by rd.sale_id
  ), '[]'::json) as redemptions,
  attendees.name,
  attendees.email,
  attendees.phone,
  exists(
     select id from payments where
     payments.sale_id = sales.id and refund_id is not null
  ) as is_refunded
from sales
join attendees on attendees.id = sales.attendee_id
