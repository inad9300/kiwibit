import { list } from './list'
import { checkbox } from './checkbox'

export function shoppingList() {
  const id = 'shoppingListCheckbox1'

  const check = checkbox()
  check.id = id

  const label = document.createElement('label')
  label.htmlFor = id
  label.textContent = 'Pistachio Ice Cream'

  const item = document.createElement('li')
  item.append(check, label)

  const root = list()
  root.append(item)

  return root
}
