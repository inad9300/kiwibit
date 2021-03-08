import { pool } from '../pool'

const nutrientCategoryOrder = ['Minerals', 'Vitamins', 'Proteins', 'Fats', 'Carbohydrates', 'Other']

export async function findFoodDetails(data: { id: number, nutrients: number[] }) {
  const maybeNutrients = data.nutrients.length === 0 ? null : data.nutrients
  const { rows: nutrients } = await pool.runStaticQuery`
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
    where f.id = ${data.id}
    and (${maybeNutrients}::int[] is null or n.id = any(${maybeNutrients}))
  `

  if (data.nutrients.length > 0 && nutrients.length > 0) {
    const { rows: remainingNutrients } = await pool.runStaticQuery`
      select
        null as name,
        n.id nutrient_id,
        n.name nutrient_name,
        n.alias nutrient_alias,
        null unit_abbr,
        null::int amount,
        nc.name nutrient_category_name,
        null food_category_name,
        null food_category_color
      from nutrients n
      left join nutrient_categories nc on (nc.id = n.category_id)
      where n.id = any(${data.nutrients})
      and not (n.id = any(${nutrients.map(r => r.nutrient_id)}))
    `

    nutrients.push(...remainingNutrients)
  }

  const { name, food_category_name, food_category_color } = nutrients[0]

  return {
    name,
    food_category_name,
    food_category_color,
    nutrients: nutrients
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
