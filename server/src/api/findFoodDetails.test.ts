import { findFoodDetails } from '.'
import { ok } from 'assert'

export default {
  'returns an object': async () => {
    const res = await findFoodDetails({ id: 1, showAll: false })
    ok(typeof res === 'object')
    ok(Object.keys(res).length > 1)
  }
}
