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
  food_category_name: schema.usda_categories['name']
  food_category_color: schema.usda_categories['color']
}

const nutrientCategoryOrder = ['Minerals', 'Vitamins', 'Proteins', 'Fats', 'Carbohydrates', 'Other']

export async function findFoodDetails(data: { id: number, nutrients: number[] }) {
  const { rows } = await pool.query<FoodDetails>(`
    select
      f.name,
      n.id nutrient_id,
      n.name nutrient_name,
      n.alias nutrient_alias,
      u.abbr unit_abbr,
      fn.amount,
      nc.name nutrient_category_name,
      uc.name food_category_name,
      uc.color food_category_color
    from foods f
    join food_nutrients fn on (fn.food_id = f.id)
    join nutrients n on (n.id = fn.nutrient_id)
    left join nutrient_categories nc on (nc.id = n.category_id)
    left join units u on (u.id = n.unit_id)
    left join usda_categories uc on (uc.id = f.usda_category_id)
    where f.id = $1
    and ($2::int[] is null or n.id = any($2))
  `, [data.id, data.nutrients.length === 0 ? null : data.nutrients])

  if (data.nutrients.length > 0 && rows.length > 0) {
    const remainingNutrients = await pool.query<FoodDetails>(`
      select
        null as name,
        n.id nutrient_id,
        n.name nutrient_name,
        n.alias nutrient_alias,
        null unit_abbr,
        null amount,
        nc.name nutrient_category_name,
        null food_category_name,
        null food_category_color
      from nutrients n
      left join nutrient_categories nc on (nc.id = n.category_id)
      where n.id = any($1)
      and not (n.id = any($2))
    `, [data.nutrients, rows.map(r => r.nutrient_id)])

    rows.push(...remainingNutrients.rows)
  }

  const { name, food_category_name, food_category_color } = rows[0]

  return {
    name,
    food_category_name,
    food_category_color,
    nutrients: rows
      .sort((a, b) => {
        if (a.nutrient_category_name === b.nutrient_category_name) {
          return a.nutrient_name > b.nutrient_name ? 1 : -1
        }
        return nutrientCategoryOrder.indexOf(a.nutrient_category_name)
             - nutrientCategoryOrder.indexOf(b.nutrient_category_name)
      })
      .map(d => ({
        id: d.nutrient_id,
        name: d.nutrient_name,
        alias: d.nutrient_alias,
        unit_abbr: d.unit_abbr,
        amount: d.amount as number | null,
        category_name: d.nutrient_category_name
      }))
  }
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await findFoodDetails({ id: 1, nutrients: [ironId] })
    ok(typeof res === 'object')
    ok(Object.keys(res).length > 1)
    ok(Array.isArray(res.nutrients))
    ok(res.nutrients.length === 1)
    ok(res.nutrients[0].id === ironId)
    ok(res.nutrients[0].name === 'Iron')
  }
})
