import { api } from '../utils/api'
import { Select } from '../components/Select'
import type { NutrientWithUnit } from '../../../server/src/api/getAllNutrients'

export function NutrientSelect() {
  const select = Select<NutrientWithUnit>(
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
