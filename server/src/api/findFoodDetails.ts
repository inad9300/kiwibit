import { pool } from '../pool'
import * as schema from '../schema'

type FoodDetails = {
  name: schema.foods['name']
  nutrient_id: schema.nutrients['id']
  nutrient_name: schema.nutrients['name']
  nutrient_alias: schema.nutrients['alias']
  unit_abbr: schema.units['abbr']
  amount: schema.food_nutrients['amount']
  nutrient_category_name: schema.nutrient_categories['name']
}

export async function findFoodDetails(data: { id: number }) {
  const res = await pool.query<FoodDetails>(`
    select
      f.name,
      n.id nutrient_id,
      n.name nutrient_name,
      n.alias nutrient_alias,
      u.abbr unit_abbr,
      fn.amount,
      nc.name nutrient_category_name
    from foods f
    join food_nutrients fn on (fn.food_id = f.id)
    join nutrients n on (n.id = fn.nutrient_id)
    left join nutrient_categories nc on (nc.id = n.category_id)
    left join units u on (u.id = n.unit_id)
    where f.id = ${data.id}
    and n.is_visible_default = true
    order by (case
      when nc.name = 'Minerals' then 1
      when nc.name = 'Vitamins' then 2
      when nc.name = 'Proteins' then 3
      when nc.name = 'Fats' then 4
      when nc.name = 'Carbohydrates' then 5
      when nc.name = 'Other' then 6
    end), n.name
  `)

  return {
    name: res.rows[0].name,
    nutrients: res.rows.map(d => ({
      id: d.nutrient_id,
      name: d.nutrient_name,
      alias: d.nutrient_alias,
      unit_abbr: d.unit_abbr,
      amount: d.amount,
      category_name: d.nutrient_category_name
    }))
  }
}
