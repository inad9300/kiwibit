import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'
import { fetchSettings } from '../settings/SettingsStore'

export function FoodCategorySelect() {
  return Select<ApiOutput<'getAllUsdaCategories'>[0]>('Food Category', n => n.id!, n => n.name).with(it => {
    const promise = Promise.all([
      fetchSettings(),
      api('getAllUsdaCategories', undefined, { cache: true }),
    ])
    .then(([settings, categories]) => it.setOptions([
      { id: -1, name: 'All', color: '#fff', is_visible_default: false },
      ...categories
        .filter(n => settings.food_categories.includes(n.id))
        .sort((a, b) => (a.name > b.name ? 1 : -1))
    ]))

    return { promise }
  })
}
