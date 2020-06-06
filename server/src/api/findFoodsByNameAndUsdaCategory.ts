import { pool } from '../pool'
import * as schema from '../schema'

type Food = {
  id: schema.foods['id']
  name: schema.foods['name']
}

export async function findFoodsByNameAndUsdaCategory(data: {
  foodName: string
  usdaCategoryId: number
}) {
  const res = await pool.query<Food>(`
    select f.id, f.name
    from foods f
    where lower(f.name) like '%' || lower($1) || '%'
    and f.usda_category_id = coalesce($2, f.usda_category_id)
    order by f.name
    limit 100
  `, [
    data.foodName.replace(/ /g, '%'),
    data.usdaCategoryId === -1 ? null : data.usdaCategoryId
  ])
  return res.rows
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an array': async () => {
    const res = await findFoodsByNameAndUsdaCategory({ foodName: 'blue', usdaCategoryId: -1 })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
