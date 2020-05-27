import { pool } from '../pool'
import { nutrients, units } from '../schema'

type NutrientWithUnit = {
  id: nutrients['id']
  name: nutrients['name']
  alias: nutrients['alias']
  abbr: nutrients['abbr']
  unit_name: units['name']
  unit_abbr: units['abbr']
}

export async function getAllNutrients() {
  const res = await pool.query<NutrientWithUnit>(`
    select n.id, n.name, n.alias, n.abbr, u.name unit_name, u.abbr unit_abbr
    from nutrients n
    join units u on (u.id = n.unit_id)
    where n.is_visible_default = true
  `)
  return res.rows
}
