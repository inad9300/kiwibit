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
    select f.id, f.name
    from foods f
    where lower(f.name) like '%' || lower($1) || '%'
    and ($2::int[] is null or f.usda_category_id = any($2))
    order by f.name
    limit 100
  `, [
    data.foodName.replace(/ /g, '%'),
    data.usdaCategoryIds.length === 0 ? null : data.usdaCategoryIds
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
