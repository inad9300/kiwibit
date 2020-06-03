import { findFoodsByNameAndUsdaCategory } from '.'
import { ok } from 'assert'

export default {
  'returns an array': async () => {
    const res = await findFoodsByNameAndUsdaCategory({ foodName: 'blue', usdaCategoryId: -1 })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
}
