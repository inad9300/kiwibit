import { getAllUsdaCategories } from '.'
import { ok } from 'assert'

export default {
  'returns an array': async () => {
    const res = await getAllUsdaCategories()
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
}
