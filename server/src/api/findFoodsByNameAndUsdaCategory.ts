import { pool } from '../pool'
import * as schema from '../schema'

type Food = {
  id: schema.foods['id']
  name: schema.foods['name']
}

export async function findFoodsByNameAndUsdaCategory(data: {
  foodName: string
  usdaCategoryIds: number[]
}) {
  const res = await pool.query<Food>(`
    (
      (select f.id, f.name
      from foods f
      where ($1::int[] is null or f.usda_category_id = any($1))
      and f.name_tokens @@ websearch_to_tsquery($2)
      order by f.name)
    union
      (select f.id, f.name
      from foods f
      where ($1::int[] is null or f.usda_category_id = any($1))
      and lower(f.name) like '%' || lower($3) || '%'
      order by f.name)
    )
    limit 100
  `, [
    data.usdaCategoryIds.length === 0 ? null : data.usdaCategoryIds,
    data.foodName,
    data.foodName.replace(/ /g, '%')
  ])
  return res.rows
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an array': async () => {
    const res = await findFoodsByNameAndUsdaCategory({ foodName: 'blue', usdaCategoryIds: [] })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
