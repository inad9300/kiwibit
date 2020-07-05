import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { CategoryCircle } from './CategoryCircle'
import type { ApiOutput } from '../utils/api'

export function BarTooltipContent(food: ApiOutput<'getTopFoodsForNutrient'>[0]) {
  const nameRow = Html('div').with(it => {
    it.textContent = food.name
  })

  const categoryCircle = CategoryCircle(food.color).with(it => {
    it.style.marginTop = '2px'
  })

  const categoryName = Html('div').with(it => {
    it.textContent = food.usda_category_name
    it.style.fontStyle = 'italic'
  })

  const categoryRow = Hbox().with(it => {
    it.setChildren([categoryCircle, categoryName], '4px')
  })

  const amountRow = Html('div').with(it => {
    it.textContent = `${food.amount} ${food.unit_abbr}`
    it.style.fontWeight = 'bold'
  })

  return Vbox().with(it => {
    it.setChildren([nameRow, categoryRow, amountRow], '3px')
  })
}
