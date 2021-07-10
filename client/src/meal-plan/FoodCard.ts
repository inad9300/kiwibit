import { Html } from '../components/Html'
import { List } from '../components/List'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
import { FoodListItem } from './FoodListItem'
import { getDatePartAsString } from '../utils/getDatePartAsString'
import { ControlTitle } from '../components/ControlTitle'

const longWeekDayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long' })

export function FoodCard(date: Date) {
  const placeholderItem = Html('li').with(it => {
    it.hidden = true
    it.style.height = '25px'
  })

  const foodList = List().with(it => {
    it.style.padding = '8px 0'
    it.style.height = '280px'
    it.style.overflowY = 'auto'
    it.append(placeholderItem)
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

    let draggingItem: HTMLElement | undefined
    let droppingItem: HTMLElement | undefined

    function onMouseMove({ clientY }: MouseEvent) {
      if (!draggingItem) {
        return
      }

      draggingItem.style.top = clientY - 13 + 'px'
      droppingItem = undefined

      for (let i = 0; i < foodList.children.length; ++i) {
        const child = foodList.children[i] as HTMLElement
        if (child !== draggingItem && child !== placeholderItem && child.tagName === 'LI') {
          const { top, bottom } = child.getBoundingClientRect()
          if (clientY > top && clientY < bottom) {
            child.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            droppingItem = child
          } else {
            child.style.backgroundColor = '#f4f9ff'
          }
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove, true)

    window.addEventListener('mouseup', () => {
      if (!draggingItem) {
        return
      }

      if (droppingItem) {
        foodList.append(
          List().with(it => {
            it.style.marginLeft = '8px'
            it.append(
              ControlTitle('New recipe').with(it => {
                it.contentEditable = 'true'
                it.style.fontSize = '14px'
                it.style.margin = '0 8px 3px 0'
              }),
              droppingItem!,
              draggingItem!
            )
          })
        )
        droppingItem.style.backgroundColor = '#f4f9ff'
        droppingItem = undefined
      }

      foodList.style.pointerEvents = 'initial'
      draggingItem.style.width = 'auto'
      draggingItem.style.position = 'initial'
      draggingItem.style.opacity = '1'
      draggingItem.style.backgroundColor = '#f4f9ff'
      draggingItem = undefined

      placeholderItem.hidden = true
    }, true)

    let dateStr = getDatePartAsString(date)

    return {
      onAddFoodClick() {},
      onAmountChange(_foodId: number, _amount: number) {},
      getDate() {
        return dateStr
      },
      setDate(d: Date) {
        dateStr = getDatePartAsString(d)
        foodList.innerHTML = ''
        foodList.append(placeholderItem)
      },
      addFood(food: { id: number, name: string }, initialAmount: number) {
        foodList.append(
          FoodListItem(food, initialAmount).with(it => {
            it.onAmountChange = newAmount => root.onAmountChange(food.id, newAmount)
            it.style.padding = '0 8px'
            it.style.marginTop = foodList.children.length === 0 ? '0' : '-1px'
            it.style.backgroundColor = '#f4f9ff'

            it.addEventListener('mousedown', evt => {
              if (foodList.children.length > 2) {
                evt.preventDefault()
                foodList.style.pointerEvents = 'none'
                const { width, left } = it.getBoundingClientRect()
                it.style.width = width + 'px'
                it.style.left = left + 'px'
                it.style.position = 'fixed'
                it.style.opacity = '0.5'
                draggingItem = it
                onMouseMove(evt)
              }
            }, true)
          })
        )
        root.onAmountChange(food.id, initialAmount)
      }
    }
  })

  return root
}
