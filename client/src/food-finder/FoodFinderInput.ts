import { api, ApiOutput } from '../utils/api'
import { Typeahead } from '../components/Typeahead'

export function FoodFinderInput() {
  let usdaCategoryId = -1

  return Typeahead<ApiOutput<'findFoodsByNameAndUsdaCategory'>[0]>(
    'Food',
    'e.g. "lentils cooked" (at least 3 characters)',
    searchTerm => api('findFoodsByNameAndUsdaCategory', { foodName: searchTerm, usdaCategoryId }),
    f => f.name
  )
  .with(it => {
    it.style.width = '275px'
    it.style.marginLeft = '-1px'

    return {
      setUsdaCategoryId(id: number) {
        usdaCategoryId = id
      }
    }
  })
}
