import { Html } from '../components/Html'
import { List } from '../components/List'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { FoodListItem } from './FoodListItem'

const longWeekDayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

export function FoodDayCard(date: Date) {
  const foodList = List().with(it => {
    it.style.padding = '8px'
    it.style.height = '280px'
    it.style.overflowY = 'auto'
  })

  const root = Card().with(it => {
    it.style.display = 'inline-flex'
    it.style.padding = '0'
    it.style.margin = '0 8px'
    it.style.width = '300px'
    it.style.backgroundColor = '#f4f9ff'
    it.append(
      Html('h2').with(it => {
        it.textContent = longWeekDayFmt.format(date)
        it.style.fontSize = '15px'
        it.style.fontWeight = 'normal'
        it.style.textAlign = 'center'
        it.style.margin = '0'
        it.style.padding = '5px'
        it.style.borderBottom = '1px solid lightgrey'
        it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.15)'
        it.style.backgroundColor = '#e3ebf5'
        it.style.position = 'relative'

        it.append(
          Icon('plus').with(it => {
            it.style.position = 'absolute'
            it.style.top = it.style.right = '2px'
            it.style.width = it.style.height = it.style.borderRadius = '24px'
            it.style.padding = '5px'
            it.style.cursor = 'pointer'
            it.onmouseenter = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            it.onmouseleave = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0)'
            it.onclick = () => root.onAddFoodClick()
          })
        )
      }),
      foodList
    )

    return {
      onAddFoodClick() {},
      onAmountChange(_foodId: number, _amount: number) {},
      addFood(food: { id: number, name: string }, initialAmount: number) {
        foodList.append(
          FoodListItem(food, initialAmount).with(it => {
            it.onAmountChange = newAmount => root.onAmountChange(food.id, newAmount)
            it.style.marginTop = foodList.children.length === 0 ? '0' : '-1px'
          })
        )
        root.onAmountChange(food.id, initialAmount)
      }
    }
  })

  return root
}
