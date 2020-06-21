import { pool } from '../pool'

let energyId: number

pool
  .query(`select id from nutrients where name = 'Energy'`)
  .then(res => (energyId = res.rows[0].id))

type FoodNutrient = {
  id: number
  name: string
  amount: number
  unit_abbr: string
  color: string
  usda_category_name: string
}

export async function getTopFoodsForNutrient(data: {
  nutrientId: number
  per: 'weight' | 'energy'
  categories: number[]
  offset: number
  limit: number
}) {
  const orderBy =
    data.per === 'weight' || data.nutrientId === energyId
      ? 'fn.amount'
      : `(
        100 * fn.amount / (
          select fe.amount
          from food_nutrients fe
          where fe.food_id = fn.food_id
          and fe.nutrient_id = ${energyId}
          and fe.amount > 0
        )
      )`

  const res = await pool.query<FoodNutrient>(`
    select f.id, f.name, ${orderBy} amount, uc.color, uc.name usda_category_name, (
        select u.abbr
        from nutrients n
        left join units u on (u.id = n.unit_id)
        where n.id = $1
      ) unit_abbr
    from foods f
    join food_nutrients fn on (fn.food_id = f.id)
    left join usda_categories uc on (uc.id = f.usda_category_id)
    where fn.nutrient_id = $1
    and ${orderBy} is not null
    and ($2::int[] is null or uc.id = any($2))
    order by ${orderBy} desc
    offset $3
    limit $4
  `, [
    data.nutrientId,
    data.categories.length === 0 ? null : data.categories,
    data.offset,
    data.limit
  ])

  return res.rows
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an array': async () => {
    const ironId = 25
    const res = await getTopFoodsForNutrient({ nutrientId: ironId, per: 'weight', offset: 0, limit: 11, categories: [] })
    ok(Array.isArray(res))
    ok(res.length > 10)
  },
  'returns an array, with categories': async () => {
    const ironId = 25
    const spicesAndHerbsId = 2
    const res = await getTopFoodsForNutrient({ nutrientId: ironId, per: 'weight', offset: 0, limit: 11, categories: [spicesAndHerbsId] })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
