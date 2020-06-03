import { getIntakeMetadataForAllNutrients } from '.'
import { ok } from 'assert'

export default {
  'returns an array': async () => {
    const res = await getIntakeMetadataForAllNutrients({ age: 26, gender: 'M' })
    ok(Array.isArray(res))
    ok(res.length > 10)
  }
}
