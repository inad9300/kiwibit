import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, eq } from '../../../shared/test'

export async function getIntakeMetadataForNutrient(data: {
  nutrientId: number
  age: number
  gender: 'M' | 'F'
}) {
  const [rdi, ul] = await Promise.all([
    pool.run(sql`
      select rdi.value
      from reference_intakes rdi
      where rdi.nutrient_id = ${data.nutrientId}
      and rdi.age_min <= ${data.age}
      and rdi.age_max >= ${data.age}
      and rdi.gender = ${data.gender}
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `),
    pool.run(sql`
      select ul.value
      from tolerable_intakes ul
      where ul.nutrient_id = ${data.nutrientId}
      and ul.age_min <= ${data.age}
      and ul.age_max >= ${data.age}
      and ul.gender = ${data.gender}
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `)
  ])

  return {
    rdi: rdi.rows[0]?.value,
    ul: ul.rows[0]?.value
  }
}

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await getIntakeMetadataForNutrient({ nutrientId: ironId, age: 26, gender: 'M' })
    eq(typeof res, 'object')
    eq(Object.keys(res).length, 2)
  }
})
