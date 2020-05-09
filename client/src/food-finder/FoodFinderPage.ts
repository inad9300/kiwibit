import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { api } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox } from '../components/Box'
import { Button } from '../components/Button'

export function FoodFinderPage() {
  const usdaCategorySelect = UsdaCategorySelect()
  usdaCategorySelect.onchange = () =>
    foodFinderInput.setUsdaCategoryId(usdaCategorySelect.getSelected()!.id)

  const foodDetailsTable = FoodDetailsTable()

  let lastFoodId: number
  let lastShowAll: boolean

  function loadFoodDetails(foodId: number, showAll: boolean) {
    Promise
      .all([
        api('getIntakeMetadataForAllNutrients', { age: 25, gender: 'M' }),
        api('findFoodDetails', { id: foodId, showAll })
      ])
      .then(([intakeMetadata, foodDetailsData]) => {
        lastFoodId = foodId
        lastShowAll = showAll
        showAllNutrientsBtn.textContent = showAll ? 'Show less nutrients' : 'Show more nutrients'
        foodDetailsTable.setData(intakeMetadata, foodDetailsData)
      })
  }

  const showAllNutrientsBtn = Button()
  showAllNutrientsBtn.textContent = 'Show more nutrients'
  showAllNutrientsBtn.style.padding = '4px 5px'
  showAllNutrientsBtn.style.width = 'auto'
  showAllNutrientsBtn.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  showAllNutrientsBtn.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  showAllNutrientsBtn.style.backgroundColor = '#fff'
  showAllNutrientsBtn.onclick = () => loadFoodDetails(lastFoodId, !lastShowAll)

  const foodFinderInput = FoodFinderInput()
  foodFinderInput.onSelect(foodId => loadFoodDetails(foodId, false))

  const controlsRow = Hbox([usdaCategorySelect, foodFinderInput], { gap: '8px' })

  const root = document.createElement('div')
  root.style.margin = '12px 16px'
  root.append(controlsRow, foodDetailsTable, showAllNutrientsBtn)

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId, false)
  }

  return root
}
