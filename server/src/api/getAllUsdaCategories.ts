import { pool } from '../pool'

export async function getAllUsdaCategories() {
  const res = await pool.query(`
    select id, name, color
    from usda_categories
    where is_visible_default = true
  `)
  return res.rows
}
