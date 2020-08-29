import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'
import { fetchNutrientsSettings } from '../settings/SettingsApi'

export function NutrientSelect() {
  return Select<ApiOutput<'getAllNutrients'>[0]>(
    'Nutrient',
    n => n.id!,
    n => n.name + (n.alias ? ' / ' + n.alias : ''),
    true
  )
  .with(it => {
    const promise = api('getAllNutrients', undefined, { cache: true }).then(async nutrients => {
      const userNutrients = await fetchNutrientsSettings(nutrients)
      it.setOptions(nutrients.filter(n => userNutrients.includes(n.id)), 'category')

      return nutrients
    })

    return { promise }
  })
}
