import { api } from '../utils/api'
import { Select } from '../components/Select'
import type { UsdaCategory } from '../../../server/src/api/getAllUsdaCategories'

export function UsdaCategorySelect() {
  const select = Select<UsdaCategory>('Category', n => n.id!, n => n.name)

  api('getAllUsdaCategories', undefined).then(categories => {
    categories.unshift({
      id: -1,
      name: 'All Categories',
      color: 'transparent'
    })

    select.setOptions(
      categories.sort((a, b) => (a.name > b.name ? 1 : -1))
    )
  })

  return select
}
