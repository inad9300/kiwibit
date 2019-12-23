import { list } from './list'
import { checkbox } from './checkbox'

export function dailyDozen() {
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

  const root = list()
  root.append(
    ...categories.map((cat, idx) => {
      const id = 'dailyDozenCheckbox' + idx

      const check = checkbox()
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
