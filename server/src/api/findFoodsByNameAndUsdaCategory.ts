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
    with foods_in_cat as (
      select f.id, f.name, f.name_tokens
      from foods f
      where ($1::int[] is null or f.usda_category_id = any($1))
    )
    (
      select fc.id, fc.name from foods_in_cat fc where fc.name_tokens @@ websearch_to_tsquery($2)
      union
      select fc.id, fc.name from foods_in_cat fc where lower(fc.name) like '%' || lower($3) || '%'
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
