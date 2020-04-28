import { api } from '../utils/api'
import { Select } from '../components/Select'
import type { UsdaCategory } from '../../../server/src/api/getAllUsdaCategories'

export function CategoriesSelect() {
  const select = Select<UsdaCategory>(
    'Category',
    n => n.id!,
    n => n.name
  )

  api('getAllUsdaCategories', undefined).then(categories => {
    select.setOptions([
      { id: -1, name: 'All', color: '#fff' },
      ...categories.sort((a, b) => (a.name > b.name ? 1 : -1))
    ])
  })

  return select
}
