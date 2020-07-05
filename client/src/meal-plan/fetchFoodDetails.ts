import { api, ApiOutput } from '../utils/api'

const cache: {
  [foodId: number]: Promise<ApiOutput<'findFoodDetails'>>
} = {}

export function fetchFoodDetails(id: number, nutrients: number[]) {
  if (!cache[id]) {
    cache[id] = api('findFoodDetails', { id, nutrients })
  }
  return cache[id]
}
