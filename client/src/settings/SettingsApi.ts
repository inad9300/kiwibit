import { ApiOutput } from '../utils/api'

interface Settings {
  age: number
  sex: 'M' | 'F'
  food_categories: number[]
  nutrients: number[]
}

export async function saveSettings(s: Settings) {
  localStorage.setItem('settings', JSON.stringify(s))
}

export async function fetchSettings(
  foodCategories: ApiOutput<'getAllUsdaCategories'>,
  nutrients: ApiOutput<'getAllNutrients'>
): Promise<Settings> {
  const s = localStorage.getItem('settings')
  if (s) {
    return JSON.parse(s)
  }

  return {
    age: 25,
    sex: 'M',
    food_categories: foodCategories.filter(c => c.is_visible_default).map(c => c.id),
    nutrients: nutrients.filter(n => n.is_visible_default).map(n => n.id)
  }
}

export async function fetchAgeAndSexSettings() {
  const { age, sex } = await fetchSettings([], [])
  return { age, sex }
}

export async function fetchFoodCategoriesSettings(foodCategories: ApiOutput<'getAllUsdaCategories'>) {
  return (await fetchSettings(foodCategories, [])).food_categories
}

export async function fetchNutrientsSettings(nutrients: ApiOutput<'getAllNutrients'>) {
  return (await fetchSettings([], nutrients)).nutrients
}
