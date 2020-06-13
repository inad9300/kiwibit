import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'
import { fetchFoodCategoriesSettings } from '../settings/SettingsApi'

export function FoodCategorySelect() {
  return Select<ApiOutput<'getAllUsdaCategories'>[0]>('Food Category', n => n.id!, n => n.name).with(it => {
    const promise = api('getAllUsdaCategories', undefined).then(async categories => {
      const userCategories = await fetchFoodCategoriesSettings(categories)

      it.setOptions([
        { id: -1, name: 'All', color: '#fff', is_visible_default: false },
        ...categories
          .filter(n => userCategories.includes(n.id))
          .sort((a, b) => (a.name > b.name ? 1 : -1))
      ])

      return categories
    })

    return { promise }
  })
}
