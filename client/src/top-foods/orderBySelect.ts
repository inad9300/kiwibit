export function orderBySelect() {
  const select = document.createElement('select')

  const order = [
    { text: 'Per 100 grams', value: 'weight' },
    { text: 'Per 100 calories', value: 'energy' }
  ]

  const options = order.map(o => {
    const option = document.createElement('option')
    option.value = o.value
    option.textContent = o.text
    return option
  })

  select.append(...options)

  return select
}
