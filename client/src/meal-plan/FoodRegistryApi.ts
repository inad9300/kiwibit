import { api } from '../utils/api'
import { toInt } from '../utils/toInt'
import { fetchSettings } from '../settings/SettingsApi'

type FoodRegistry = {
  [date: string]: {
    [foodId: number]: { amount: number }
  }
}

const foodRegistryStr = localStorage.getItem('foodRegistry')

export const foodRegistry: FoodRegistry = foodRegistryStr ? JSON.parse(foodRegistryStr) : {}

export function updateFoodRegistry(date: string, foodId: number, amount: number) {
  if (amount === 0) {
    if (foodRegistry[date]) {
      delete foodRegistry[date][foodId]
      if (Object.keys(foodRegistry[date]).length === 0) {
        delete foodRegistry[date]
      }
    }
  } else {
    foodRegistry[date][foodId] = { amount }
  }

  localStorage.setItem('foodRegistry', JSON.stringify(foodRegistry))
}

export async function mostFrequentFoods() {
  const foodCounts: Record<string, number> = {}
  Object
    .values(foodRegistry)
    .flatMap(Object.keys)
    .forEach((foodId) => {
      foodCounts[foodId] = foodCounts[foodId] || 0
      foodCounts[foodId]++
    })

  const { nutrients } = await fetchSettings()

  return Promise.all(
    Object
      .entries(foodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(e => toInt(e[0]))
      .map(id =>
        api('findFoodDetails', { id, nutrients }, { cache: true })
          .then(food => ({ ...food, id }))
      )
  )
}
