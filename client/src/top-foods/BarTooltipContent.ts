import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { CategoryCircle } from './CategoryCircle'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'

export function BarTooltipContent(f: FoodNutrient) {
  const nameRow = Html('div').with(it => {
    it.textContent = f.name
  })

  const categoryCircle = CategoryCircle(f.color).with(it => {
    it.style.marginTop = '2px'
  })

  const categoryName = Html('div').with(it => {
    it.textContent = f.usda_category_name
    it.style.fontStyle = 'italic'
  })

  const categoryRow = Hbox().with(it => {
    it.setChildren([categoryCircle, categoryName], '4px')
  })

  const amountRow = Html('div').with(it => {
    it.textContent = `${f.amount} ${f.unit_abbr}`
    it.style.fontWeight = 'bold'
  })

  return Vbox().with(it => {
    it.setChildren([nameRow, categoryRow, amountRow], '3px')
  })
}
