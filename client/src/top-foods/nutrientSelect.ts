import { api } from '../shared/api'

export function nutrientSelect() {
  const select = document.createElement('select')

  api('getAllNutrients', undefined).then(nutrients => {
    const options = nutrients
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(n => {
        const option = document.createElement('option')
        option.value = n.id
        option.textContent = n.name + (n.alias ? ' / ' + n.alias : '') + ' (' + n.unit_abbr + ')'
        return option
      })

    select.append(...options)
  })

  return select
}
