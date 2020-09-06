import { api } from '../utils/api'

interface Settings {
  age: number
  sex: 'M' | 'F'
  food_categories: number[]
  nutrients: number[]
}

export function saveSettings(s: Settings) {
  localStorage.setItem('settings', JSON.stringify(s))
}

export async function fetchSettings(): Promise<Settings> {
  const s = localStorage.getItem('settings')
  if (s) {
    return JSON.parse(s)
  }

  const [foodCategories, nutrients] = await Promise.all([
    api('getAllUsdaCategories', undefined, { cache: true }),
    api('getAllNutrients', undefined, { cache: true })
  ])

  return {
    age: 25,
    sex: 'M',
    food_categories: foodCategories.filter(c => c.is_visible_default).map(c => c.id),
    nutrients: nutrients.filter(n => n.is_visible_default).map(n => n.id)
  }
}
