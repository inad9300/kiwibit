import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'

export function NutrientSelect() {
  const select = Select<ApiOutput<'getAllNutrients'>[0]>(
    'Nutrient',
    n => n.id!,
    n => n.name + (n.alias ? ' / ' + n.alias : '') + ' (' + n.unit_abbr + ')'
  )
  .with(() => ({ onReady: () => {} }))

  api('getAllNutrients', undefined).then(nutrients => {
    select.setOptions(nutrients.sort((a, b) => (a.name > b.name ? 1 : -1)))
    select.onReady()
  })

  return select
}
