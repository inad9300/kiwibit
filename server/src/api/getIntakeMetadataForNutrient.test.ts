import { getIntakeMetadataForNutrient } from '.'
import { ok } from 'assert'

export default {
  'returns an object': async () => {
    const ironId = 25
    const res = await getIntakeMetadataForNutrient({ nutrientId: ironId, age: 26, gender: 'M' })
    ok(typeof res === 'object')
    ok(Object.keys(res).length > 1)
  }
}
