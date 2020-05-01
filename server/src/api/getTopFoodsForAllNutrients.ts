import { pool } from '../pool'
import { QueryResultRow } from 'pg'

/**
 * WIP
 *
 * Highest foods for every nutrient.
 */
export async function getTopFoodsForAllNutrients() {
  const res = await pool.query<QueryResultRow>(`
    select ndf.NutrDesc, t1.Nutr_Val, ndf.Units, t1.Long_Desc, t1.FdGrp_Cd, t1.FdGrp_Desc
    from (
      select t0.Nutr_No, t0.Nutr_Val, t0.Long_Desc, t0.FdGrp_Cd, t0.FdGrp_Desc,
        @rank := if(@current_nutr = t0.Nutr_No, @rank + 1, 1) as rank,
        @current_nutr := t0.Nutr_No
      from (
        select nd.Nutr_No, nd.Nutr_Val, fd.Long_Desc, fg.FdGrp_Cd, fg.FdGrp_Desc
        from food_des fd
        join nut_data nd on (nd.NDB_No = fd.NDB_No)
        join fd_group fg on (fg.FdGrp_Cd = fd.FdGrp_Cd)
        order by nd.Nutr_No asc, nd.Nutr_Val desc
      ) t0
    ) t1
    join nutr_def ndf on (ndf.Nutr_No = t1.Nutr_No)
    where t1.rank <= 100
  `)
  return res.rows
}
