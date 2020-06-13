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
    it.select.style.color = 'grey'
    it.addEventListener('change', enable)

    const _setSelected = it.setSelected
    it.setSelected = (id: number) => {
      _setSelected(id)
      if (it.getSelected()) {
        enable()
      }
    }

    function enable() {
      it.select.options.remove(0)
      it.select.style.color = 'inherit'
      it.removeEventListener('change', enable)
    }

    const promise = api('getAllNutrients', undefined).then(async nutrients => {
      const userNutrients = await fetchNutrientsSettings(nutrients)
      it.setOptions(nutrients.filter(n => userNutrients.includes(n.id)), 'category')

      return nutrients
    })

    return { promise }
  })
}
