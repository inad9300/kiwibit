import { pool } from '../pool'

export type NutrientIntakeMetadata = {
  ul?: number
  rdi?: number
}

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
