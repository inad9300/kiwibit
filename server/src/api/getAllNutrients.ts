import { pool } from '../pool'

export async function getAllNutrients() {
  const res = await pool.query(`
    select n.id, n.name, n.alias, n.abbr, u.name unit_name, u.abbr unit_abbr
    from nutrients n
    join units u on (u.id = n.unit_id)
    where n.is_visible_default = true
  `)
  return res.rows
}
