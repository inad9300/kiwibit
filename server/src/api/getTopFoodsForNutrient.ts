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
  orderBy: 'weight' | 'energy'
  categories: number[]
  offset: number
  limit: number
}) {
  const orderBy =
    data.orderBy === 'weight' || data.nutrientId === energyId
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

  const categoriesFilter = data.categories.length === 0
    ? ''
    : `and uc.id in (${data.categories.join(',')})`

  const res = await pool.query<FoodNutrient>(`
    select f.id, f.name, ${orderBy} amount, uc.color, uc.name usda_category_name, (
        select u.abbr
        from nutrients n
        left join units u on (u.id = n.unit_id)
        where n.id = ${data.nutrientId}
      ) unit_abbr
    from foods f
    join food_nutrients fn on (fn.food_id = f.id)
    left join usda_categories uc on (uc.id = f.usda_category_id)
    where fn.nutrient_id = ${data.nutrientId}
    and uc.is_visible_default = true
    and ${orderBy} is not null
    ${categoriesFilter}
    order by ${orderBy} desc
    offset ${data.offset}
    limit ${data.limit}
  `)

  return res.rows
}
