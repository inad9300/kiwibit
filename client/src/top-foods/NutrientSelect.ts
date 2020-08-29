import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'
import { fetchSettings } from '../settings/SettingsApi'

export function NutrientSelect() {
  return Select<ApiOutput<'getAllNutrients'>[0]>(
    'Nutrient',
    n => n.id!,
    n => n.name + (n.alias ? ' / ' + n.alias : ''),
    true
  )
  .with(it => {
    const promise = api('getAllNutrients', undefined, { cache: true }).then(async allNutrients => {
      const { nutrients } = await fetchSettings()
      it.setOptions(allNutrients.filter(n => nutrients.includes(n.id)), 'category')

      return allNutrients
    })

    return { promise }
  })
}
