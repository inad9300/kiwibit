import { pool } from '../pool'

export async function getAllUsdaCategories() {
  const res = await pool.runStaticQuery`
    select id, name, color, is_visible_default
    from usda_categories
  `
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
