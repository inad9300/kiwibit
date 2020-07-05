import { Html } from '../components/Html'
import { Page } from '../pages'
import { Link } from '../components/Link'
import { Spacer } from '../components/Spacer'
import { TextField } from '../components/TextField'
import { tooltip } from '../main'

export function FoodListItem(food: { id: number, name: string }, initialAmount: number) {
  const root = Html('li').with(it => {
    it.style.display = 'flex'
    it.style.fontSize = '14px'

    it.append(
      Link(`?page=${Page.FoodFinder}&food-id=${food.id}`).with(it => {
        it.textContent = food.name
        it.style.whiteSpace = 'nowrap'
        it.style.overflow = 'hidden'
        it.style.textOverflow = 'ellipsis'
        it.style.paddingTop = '3px'
        tooltip.attach(food.name, it)
      }),
      Spacer(),
      TextField().with(it => {
        it.type = 'number'
        it.min = '0'
        it.max = '9999'
        it.value = '' + initialAmount
        it.oninput = () => {
          const value = parseFloat(it.value)
          if (!isNaN(value)) {
            root.onAmountChange(value)
          }
        }
        it.onblur = () => {
          if (it.value === '' || it.value === '0') {
            root.onAmountChange(0)
            root.remove()
          }
        }
        it.style.marginLeft = '6px'
      })
    )

    return {
      onAmountChange(_amount: number) {}
    }
  })

  return root
}
