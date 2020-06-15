import { pool } from '../pool'
import * as schema from '../schema'

type IntakeMetadata = {
  value: schema.reference_intakes['value']
  age_min: schema.reference_intakes['age_min']
  age_max: schema.reference_intakes['age_max']
  gender: 'M' | 'F'
}

export async function getAllIntakeMetadataForNutrient(data: { nutrientId: number }) {
  const values = [data.nutrientId]

  const [rdis, uls] = await Promise.all([
    pool.query<IntakeMetadata>(`
      select rdi.value, rdi.age_min, rdi.age_max, rdi.gender
      from reference_intakes rdi
      where rdi.nutrient_id = $1
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `, values),
    pool.query<IntakeMetadata>(`
      select ul.value, ul.age_min, ul.age_max, ul.gender
      from tolerable_intakes ul
      where ul.nutrient_id = $1
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `, values)
  ])

  return { rdis: rdis.rows, uls: uls.rows }
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await getAllIntakeMetadataForNutrient({ nutrientId: ironId })
    ok(typeof res === 'object')
    ok(Object.keys(res).length === 2)

    ok(Array.isArray(res.rdis))
    ok(res.rdis.length > 0)

    ok(Array.isArray(res.uls))
    ok(res.uls.length > 0)
  }
})
