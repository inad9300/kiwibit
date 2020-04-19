import { List } from '../shared/List'
import { Checkbox } from '../shared/Checkbox'

export function ShoppingList() {
  const id = 'shoppingListCheckbox1'

  const check = Checkbox()
  check.id = id

  const label = document.createElement('label')
  label.htmlFor = id
  label.textContent = 'Pistachio Ice Cream'

  const item = document.createElement('li')
  item.append(check, label)

  const root = List()
  root.append(item)

  return root
}
