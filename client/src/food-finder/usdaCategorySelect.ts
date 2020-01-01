import { api } from '../shared/api'

export function usdaCategorySelect() {
  const select = document.createElement('select')

  api('getAllUsdaCategories', undefined).then(categories => {
    categories.unshift({
      id: -1,
      name: 'All Categories'
    })

    const options = categories
      .sort((a, b) => (a.name > b.name ? 1 : -1))
      .map(c => {
        const option = document.createElement('option')
        option.value = c.id
        option.textContent = c.name

        return option
      })

    select.append(...options)
  })

  return select
}
