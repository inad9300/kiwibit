import { pool } from '../pool'

export async function getIntakeMetadataForNutrient(data: {
  nutrientId: number
  age: number
  gender: 'M' | 'F'
}) {
  const values = [
    data.nutrientId,
    data.age,
    data.gender
  ]

  const [rdi, ul] = await Promise.all([
    pool.query<{ value: number }>(`
      select rdi.value
      from reference_intakes rdi
      where rdi.nutrient_id = $1
      and rdi.age_min <= $2
      and rdi.age_max >= $2
      and rdi.gender = $3
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `, values),
    pool.query<{ value: number }>(`
      select ul.value
      from tolerable_intakes ul
      where ul.nutrient_id = $1
      and ul.age_min <= $2
      and ul.age_max >= $2
      and ul.gender = $3
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `, values)
  ])

  return {
    rdi: rdi.rows[0]?.value,
    ul: ul.rows[0]?.value
  }
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await getIntakeMetadataForNutrient({ nutrientId: ironId, age: 26, gender: 'M' })
    ok(typeof res === 'object')
    ok(Object.keys(res).length === 2)
  }
})
