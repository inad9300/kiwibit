import { Html } from '../components/Html'
import { Backdrop } from '../components/Backdrop'
import { FoodFinderInput } from '../food-finder/FoodFinderInput'
import { fetchSettings } from '../settings/SettingsApi'
import { mostFrequentFoods } from './FoodRegistryApi'
import { Vbox } from '../components/Box'
import { ControlTitle } from '../components/ControlTitle'
import { Span } from '../components/Span'

export function AddFoodModal() {
  const foodFinderInput = FoodFinderInput().with(it => {
    it.style.width = '100%'
    fetchSettings().then(({ food_categories }) => it.setUsdaCategoryIds(food_categories))

    it.onSelect = food => {
      root.onAddFood(food.id)
      root.hidden = true
    }
  })

  const recurrentFoodsList = Vbox().with(it => {
    it.style.fontSize = '13px'
    it.style.margin = '1px -16px 0 -16px'
    it.style.maxHeight = '413px'
    it.style.overflowY = 'auto'
  })

  const recurrentFoods = Vbox().with(async it => {
    it.style.marginTop = '8px'
    it.append(ControlTitle('Frequently used'), recurrentFoodsList)
  })

  const root = Backdrop().with(it => {
    it.append(
      Html('div').with(it => {
        it.style.height = 'fit-content'
        it.style.padding = '16px'
        it.style.backgroundColor = '#fff'
        it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)'
        it.onclick = evt => evt.stopPropagation()
        it.append(foodFinderInput, recurrentFoods)
      })
    )

    window.addEventListener('keyup', evt => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        it.hidden = true
      }
    })

    return {
      onAddFood(_foodId: number) {},
      async open() {
        root.hidden = false
        foodFinderInput.focus()

        recurrentFoodsList.append(
          ...(await mostFrequentFoods()).map(f => Span(f.name).with(it => {
            it.style.padding = '2px 16px'
            it.style.cursor = 'pointer'
            it.style.backgroundColor = '2px solid transparent'
            it.onmouseenter = () => it.style.backgroundColor = '#eee'
            it.onmouseleave = () => it.style.backgroundColor = 'transparent'
            it.onclick = () => {
              root.onAddFood(f.id)
              root.hidden = true
            }
          }))
        )
      }
    }
  })

  return root
}
