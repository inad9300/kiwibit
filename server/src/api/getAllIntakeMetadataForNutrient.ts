import { pool } from '../pool'
import * as schema from '../schema'

type IntakeMetadata = {
  value: schema.reference_intakes['value']
  age_min: schema.reference_intakes['age_min']
  age_max: schema.reference_intakes['age_max']
  gender: 'M' | 'F'
}

export async function getAllIntakeMetadataForNutrient(data: { nutrientId: number }) {
  const [unitMetadata, rdis, uls] = await Promise.all([
    pool.runStaticQuery<{ abbr: schema.units['abbr'] }>`
      select u.abbr
      from nutrients n
      left join units u on (u.id = n.unit_id)
      where n.id = ${data.nutrientId}
    `,
    pool.runStaticQuery<IntakeMetadata>`
      select rdi.value, rdi.age_min, rdi.age_max, rdi.gender
      from reference_intakes rdi
      where rdi.nutrient_id = ${data.nutrientId}
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `,
    pool.runStaticQuery<IntakeMetadata>`
      select ul.value, ul.age_min, ul.age_max, ul.gender
      from tolerable_intakes ul
      where ul.nutrient_id = ${data.nutrientId}
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `
  ])

  return {
    unit_abbr: unitMetadata.rows[0]?.abbr,
    rdis: rdis.rows,
    uls: uls.rows
  }
}

import { test } from '../../../shared/test'
import { ok } from 'assert'

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await getAllIntakeMetadataForNutrient({ nutrientId: ironId })
    ok(typeof res === 'object')
    ok(Object.keys(res).length === 3)

    ok(typeof res.unit_abbr === 'string')

    ok(Array.isArray(res.rdis))
    ok(res.rdis.length > 0)

    ok(Array.isArray(res.uls))
    ok(res.uls.length > 0)
  },
  'stands nutrients without data': async () => {
    const unknownNutrientId = 1234567890
    const res = await getAllIntakeMetadataForNutrient({ nutrientId: unknownNutrientId })
    ok(res.unit_abbr === undefined)
    ok(res.rdis.length === 0)
    ok(res.uls.length === 0)
  }
})
