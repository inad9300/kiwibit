import { getAllNutrients } from '.'
import { ok } from 'assert'

export default {
  'returns an array': async () => {
    const res = await getAllNutrients()
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
}
