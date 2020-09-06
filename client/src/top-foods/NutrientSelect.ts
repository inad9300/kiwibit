import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'
import { fetchSettings } from '../settings/SettingsStore'

export function NutrientSelect() {
  return Select<ApiOutput<'getAllNutrients'>[0]>(
    'Nutrient',
    n => n.id!,
    n => n.name + (n.alias ? ' / ' + n.alias : ''),
    true
  )
  .with(it => {
    const promise = Promise.all([
      fetchSettings(),
      api('getAllNutrients', undefined, { cache: true })
    ])
    .then(([settings, allNutrients]) => it.setOptions(
      allNutrients.filter(n => settings.nutrients.includes(n.id)),
      'category'
    ))

    return { promise }
  })
}
