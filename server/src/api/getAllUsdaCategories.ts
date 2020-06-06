import { pool } from '../pool'

type UsdaCategory = {
  id: number
  name: string
  color: string
}

export async function getAllUsdaCategories() {
  const res = await pool.query<UsdaCategory>(`
    select id, name, color
    from usda_categories
    where is_visible_default = true
  `)
  return res.rows
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an array': async () => {
    const res = await getAllUsdaCategories()
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
