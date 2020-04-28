import { List } from '../components/List'
import { Checkbox } from '../components/Checkbox'

export function DailyDozen() {
  const categories = [
    'Beans',
    'Berries',
    'Other Fruit',
    'Cruciferous Vegetables',
    'Greens',
    'Other Vegetables',
    'Flaxseeds',
    'Nuts and Seeds',
    'Herbs and Spices',
    'Whole Grains',
    'Beverages',
    'Exercise'
  ]

  const root = List()
  root.append(
    ...categories.map((cat, idx) => {
      const id = 'dailyDozenCheckbox' + idx

      const check = Checkbox()
      check.id = id

      const label = document.createElement('label')
      label.htmlFor = id
      label.textContent = cat

      const item = document.createElement('li')
      item.append(check, label)

      return item
    })
  )

  return root
}
