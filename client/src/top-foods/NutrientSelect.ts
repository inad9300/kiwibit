import { api, ApiOutput } from '../utils/api'
import { Select } from '../components/Select'

export function NutrientSelect() {
  const select = Select<ApiOutput<'getAllNutrients'>[0]>(
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
      enable()
    }

    function enable() {
      it.select.options.remove(0)
      it.select.style.color = 'inherit'
      it.removeEventListener('change', enable)
    }

    return { onReady: () => {} }
  })

  api('getAllNutrients', undefined).then(nutrients => {
    select.setOptions(nutrients, 'category')
    select.onReady()
  })

  return select
}
