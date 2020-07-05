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
