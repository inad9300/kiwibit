import { pool } from '../pool'
import { QueryResultRow } from 'pg'

export async function findFoodsByNameAndUsdaCategory(data: {
  foodName: string
  usdaCategoryId: number
}) {
  const res = await pool.query<QueryResultRow>(`
    select f.id, f.name
    from foods f
    where lower(f.name) like '%' || lower('${data.foodName.replace(/ /g, '%')}') || '%'
    and f.usda_category_id = ${
      data.usdaCategoryId === -1 ? 'f.usda_category_id' : data.usdaCategoryId
    }
    order by f.name
    limit 100
  `)
  return res.rows
}
