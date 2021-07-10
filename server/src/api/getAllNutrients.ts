import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, ok } from '../../../shared/test'

export async function getAllNutrients() {
  const res = await pool.run(sql`
    select n.id, n.name, n.alias, n.abbr, n.is_visible_default, u.name unit_name, u.abbr unit_abbr, nc.name category
    from nutrients n
    left join units u on (u.id = n.unit_id)
    left join nutrient_categories nc on (nc.id = n.category_id)
    order by (case
      when nc.name = 'Minerals' then 1
      when nc.name = 'Vitamins' then 2
      when nc.name = 'Proteins' then 3
      when nc.name = 'Fats' then 4
      when nc.name = 'Carbohydrates' then 5
      when nc.name = 'Other' then 6
    end), n.name
  `)
  return res.rows
}

test({
  'returns an array': async () => {
    const res = await getAllNutrients()
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
