import { getTopFoodsForNutrient } from '.'
import { ok } from 'assert'

export default {
  'returns an array': async () => {
    const ironId = 25
    const res = await getTopFoodsForNutrient({ nutrientId: ironId, orderBy: 'weight', offset: 0, limit: 11, categories: [] })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
}
