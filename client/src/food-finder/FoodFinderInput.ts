import { api, ApiOutput } from '../utils/api'
import { Typeahead } from '../components/Typeahead'

export function FoodFinderInput() {
  let usdaCategoryIds: number[] = []

  return Typeahead<ApiOutput<'findFoodsByNameAndUsdaCategory'>[0]>(
    'Food',
    'e.g. "cooked lentils" (at least 3 characters)',
    searchTerm => api('findFoodsByNameAndUsdaCategory', { foodName: searchTerm, usdaCategoryIds }, { cache: true }),
    f => f.name
  )
  .with(it => {
    it.style.width = '275px'
    it.style.marginLeft = '-1px'

    return {
      setUsdaCategoryIds(ids: number[]) {
        usdaCategoryIds = ids
      }
    }
  })
}
