import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, ok } from '../../../shared/test'

const energyIdPromise = pool
  .run(sql`select id from nutrients where name = 'Energy'`)
  .then(res => res.rows[0].id)

export async function getTopFoodsForNutrient(data: {
  nutrientId: number
  per: 'weight' | 'energy'
  categories: number[]
  offset: number
  limit: number
}) {
  const energyId = await energyIdPromise
  const maybeCategories = data.categories.length === 0 ? null : data.categories
  const perWeight = data.per === 'weight'

  const res = await pool.run(sql`
    with food_nutrients_ext as (
      select fn.nutrient_id, fn.food_id, fn.amount as amount_weight, (100 * fn.amount / en.amount) as amount_energy
      from food_nutrients fn
      left join food_nutrients en on (en.nutrient_id = ${energyId} and en.food_id = fn.food_id and en.amount > 0)
    )
    select
      f.id,
      f.name,
      (case when ${perWeight} then fne.amount_weight else fne.amount_energy end) amount,
      uc.color,
      uc.name usda_category_name,
      (
        select u.abbr
        from nutrients n
        left join units u on (u.id = n.unit_id)
        where n.id = ${data.nutrientId}
      ) unit_abbr
    from foods f
    join food_nutrients_ext fne on (fne.food_id = f.id)
    left join usda_categories uc on (uc.id = f.usda_category_id)
    where fne.nutrient_id = ${data.nutrientId}
    and (case when ${perWeight} then fne.amount_weight else fne.amount_energy end) is not null
    and (${maybeCategories!}::int[] is null or uc.id = any(${maybeCategories!}))
    order by (case when ${perWeight} then fne.amount_weight else fne.amount_energy end) desc
    offset ${data.offset}::int
    limit ${data.limit}::int
  `)

  return res.rows
}

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
