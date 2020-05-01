import { pool } from '../pool'

export async function getIntakeMetadataForAllNutrients(data: { age: number; gender: 'M' | 'F' }) {
  const res = await pool.query<any>(`
    select *
    from (
      select n.id nutrient_id, (
          select rdi.value
          from reference_intakes rdi
          where rdi.nutrient_id = n.id
          and rdi.age_min <= ${data.age}
          and rdi.age_max >= ${data.age}
          and rdi.gender = '${data.gender}'
          and rdi.for_pregnancy = 'N'
          and rdi.for_lactation = 'N'
        ) rdi, (
          select ul.value
          from tolerable_intakes ul
          where ul.nutrient_id = n.id
          and ul.age_min <= ${data.age}
          and ul.age_max >= ${data.age}
          and ul.gender = '${data.gender}'
          and ul.for_pregnancy = 'N'
          and ul.for_lactation = 'N'
        ) ul
      from nutrients n
    ) x
    where x.rdi is not null
    or x.ul is not null
  `)

  return res.rows
}
