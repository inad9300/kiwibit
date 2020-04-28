import { pool } from '../pool'

export type UsdaCategory = {
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
