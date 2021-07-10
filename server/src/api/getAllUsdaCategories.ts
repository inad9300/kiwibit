import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, ok } from '../../../shared/test'

export async function getAllUsdaCategories() {
  const res = await pool.run(sql`
    select id, name, color, is_visible_default
    from usda_categories
  `)
  return res.rows
}

test({
  'returns an array': async () => {
    const res = await getAllUsdaCategories()
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
