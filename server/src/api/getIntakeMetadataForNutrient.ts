import { pool } from '../pool'

export async function getIntakeMetadataForNutrient(data: {
  nutrientId: number
  age: number
  gender: 'M' | 'F'
}) {
  const [rdi, ul] = await Promise.all([
    pool.query<{ value: number }>(`
      select rdi.value
      from reference_intakes rdi
      where rdi.nutrient_id = ${data.nutrientId}
      and rdi.age_min <= ${data.age}
      and rdi.age_max >= ${data.age}
      and rdi.gender = '${data.gender}'
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `),
    pool.query<{ value: number }>(`
      select ul.value
      from tolerable_intakes ul
      where ul.nutrient_id = ${data.nutrientId}
      and ul.age_min <= ${data.age}
      and ul.age_max >= ${data.age}
      and ul.gender = '${data.gender}'
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `)
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
    ok(Object.keys(res).length > 1)
  }
})
