import { pool } from '../pool'

export async function findFoodDetails(data: { id: number }) {
  const res = await pool.query<any>(`
    select
      f.name,
      n.id nutrient_id,
      n.name nutrient_name,
      n.alias nutrient_alias,
      u.abbr unit_abbr,
      fn.amount
    from foods f
    join food_nutrients fn on (fn.food_id = f.id)
    join nutrients n on (n.id = fn.nutrient_id)
    left join units u on (u.id = n.unit_id)
    where f.id = ${data.id}
    and n.is_visible_default = true
  `)

  return {
    name: res.rows[0].name,
    nutrients: res.rows.map((d: any) => ({
      id: d.nutrient_id,
      name: d.nutrient_name,
      alias: d.nutrient_alias,
      unit_abbr: d.unit_abbr,
      amount: d.amount
    }))
  }
}
