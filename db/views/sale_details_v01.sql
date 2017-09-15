select
  sales.id as sale_id,
  coalesce((
    select
      json_agg((select x from (
          select rd.qty, rd.created_at at time zone 'UTC' as created_at
      ) x)) AS redemptions
    from redemptions rd where rd.sale_id = sales.id group by rd.sale_id
  ), '[]'::json) as redemptions
from sales
