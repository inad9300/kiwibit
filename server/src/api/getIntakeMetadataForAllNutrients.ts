import { pool } from '../pool'
import * as schema from '../schema'

type IntakeMetadata = {
  nutrient_id: schema.nutrients['id']
  rdi?: schema.reference_intakes['value']
  ul?: schema.tolerable_intakes['value']
}

export async function getIntakeMetadataForAllNutrients(data: { age: number; gender: 'M' | 'F' }) {
  const res = await pool.query<IntakeMetadata>(`
    select *
    from (
      select n.id nutrient_id, (
          select rdi.value
          from reference_intakes rdi
          where rdi.nutrient_id = n.id
          and rdi.age_min <= $1
          and rdi.age_max >= $1
          and rdi.gender = $2
          and rdi.for_pregnancy = 'N'
          and rdi.for_lactation = 'N'
        ) rdi, (
          select ul.value
          from tolerable_intakes ul
          where ul.nutrient_id = n.id
          and ul.age_min <= $1
          and ul.age_max >= $1
          and ul.gender = $2
          and ul.for_pregnancy = 'N'
          and ul.for_lactation = 'N'
        ) ul
      from nutrients n
    ) x
    where x.rdi is not null
    or x.ul is not null
  `, [
    data.age,
    data.gender
  ])

  return res.rows
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an array': async () => {
    const res = await getIntakeMetadataForAllNutrients({ age: 26, gender: 'M' })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
})
