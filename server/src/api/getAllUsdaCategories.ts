import { pool } from '../pool'
import { usda_categories } from '../schema'

type UsdaCategory = {
  id: usda_categories['id']
  name: usda_categories['name']
  color: usda_categories['color']
  is_visible_default: usda_categories['is_visible_default']
}

export async function getAllUsdaCategories() {
  const res = await pool.query<UsdaCategory>(`
    select id, name, color, is_visible_default
    from usda_categories
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
