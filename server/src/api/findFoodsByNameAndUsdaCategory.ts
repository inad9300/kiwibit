import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, ok } from '../../../shared/test'

export async function findFoodsByNameAndUsdaCategory(data: {
  foodName: string
  usdaCategoryIds: number[]
}) {
  const maybeCategories = data.usdaCategoryIds.length === 0 ? null : data.usdaCategoryIds
  const res = await pool.run(sql`
    with foods_in_cat as (
      select f.id, f.name, f.name_tokens
      from foods f
      where (${maybeCategories!}::int[] is null or f.usda_category_id = any(${maybeCategories!}))
    )
    (
      select fc.id, fc.name from foods_in_cat fc where fc.name_tokens @@ websearch_to_tsquery(${data.foodName})
      union
      select fc.id, fc.name from foods_in_cat fc where lower(fc.name) like '%' || lower(${data.foodName.replace(/ /g, '%')}) || '%'
    )
    limit 100
  `)
  return res.rows
}

test({
  'returns an array': async () => {
    const res = await findFoodsByNameAndUsdaCategory({ foodName: 'blue', usdaCategoryIds: [] })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
