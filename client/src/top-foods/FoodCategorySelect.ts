import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'

export function FoodCategorySelect() {
  const select = Select<ApiOutput<'getAllUsdaCategories'>[0]>('Food Category', n => n.id!, n => n.name)

  api('getAllUsdaCategories', undefined).then(categories => {
    select.setOptions([
      { id: -1, name: 'All', color: '#fff', is_visible_default: false },
      ...categories.sort((a, b) => (a.name > b.name ? 1 : -1))
    ])
  })

  return select
}
