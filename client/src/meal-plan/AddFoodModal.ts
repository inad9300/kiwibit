import { Html } from '../components/Html'
import { Backdrop } from '../components/Backdrop'
import { FoodFinderInput } from '../food-finder/FoodFinderInput'
import { api } from '../utils/api'
import { fetchFoodCategoriesSettings } from '../settings/SettingsApi'

export function AddFoodModal() {
  const foodFinderInput = FoodFinderInput().with(it => {
    api('getAllUsdaCategories', undefined)
      .then(fetchFoodCategoriesSettings)
      .then(userCategories => it.setUsdaCategoryIds(userCategories))

    it.onSelect = food => {
      root.onAddFood(food.id)
      root.hidden = true
    }
  })

  const root = Backdrop().with(it => {
    it.append(
      Html('div').with(it => {
        it.style.height = 'fit-content'
        it.style.padding = '16px'
        it.style.backgroundColor = '#fff'
        it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)'
        it.onclick = evt => evt.stopPropagation()
        it.append(foodFinderInput)
      })
    )

    window.addEventListener('keyup', evt => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        it.hidden = true
      }
    })

    return {
      onAddFood(_foodId: number) {},
      focus() {
        foodFinderInput.focus()
      }
    }
  })

  return root
}
