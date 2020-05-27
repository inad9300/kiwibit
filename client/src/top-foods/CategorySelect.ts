import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'

export function CategorySelect() {
  const select = Select<ApiOutput<'getAllUsdaCategories'>[0]>('Category', n => n.id!, n => n.name)

  api('getAllUsdaCategories', undefined).then(categories => {
    select.setOptions([
      { id: -1, name: 'All', color: '#fff' },
      ...categories.sort((a, b) => (a.name > b.name ? 1 : -1))
    ])
  })

  return select
}
