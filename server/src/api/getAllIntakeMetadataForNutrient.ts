import { sql } from 'pgeon/postgres-client'
import { pool } from '../pool'
import { test, ok, eq } from '../../../shared/test'

export async function getAllIntakeMetadataForNutrient(data: { nutrientId: number }) {
  const [unitMetadata, rdis, uls] = await Promise.all([
    pool.run(sql`
      select u.abbr
      from nutrients n
      left join units u on (u.id = n.unit_id)
      where n.id = ${data.nutrientId}
    `),
    pool.run(sql`
      select rdi.value, rdi.age_min, rdi.age_max, rdi.gender
      from reference_intakes rdi
      where rdi.nutrient_id = ${data.nutrientId}
      and rdi.for_pregnancy = 'N'
      and rdi.for_lactation = 'N'
    `),
    pool.run(sql`
      select ul.value, ul.age_min, ul.age_max, ul.gender
      from tolerable_intakes ul
      where ul.nutrient_id = ${data.nutrientId}
      and ul.for_pregnancy = 'N'
      and ul.for_lactation = 'N'
    `)
  ])

  return {
    unit_abbr: unitMetadata.rows[0]?.abbr,
    rdis: rdis.rows,
    uls: uls.rows
  }
}

test({
  'returns an object': async () => {
    const ironId = 25
    const res = await getAllIntakeMetadataForNutrient({ nutrientId: ironId })
    eq(typeof res, 'object')
    eq(Object.keys(res).length, 3)

    eq(typeof res.unit_abbr, 'string')

    ok(Array.isArray(res.rdis))
    ok(res.rdis.length > 0)

    ok(Array.isArray(res.uls))
    ok(res.uls.length > 0)
  },
  'stands nutrients without data': async () => {
    const unknownNutrientId = 1234567890
    const res = await getAllIntakeMetadataForNutrient({ nutrientId: unknownNutrientId })
    eq(res.unit_abbr, undefined)
    eq(res.rdis.length, 0)
    eq(res.uls.length, 0)
  }
})
