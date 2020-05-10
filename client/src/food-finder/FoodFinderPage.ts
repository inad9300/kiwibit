import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { api } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox } from '../components/Box'

export function FoodFinderPage() {
  const usdaCategorySelect = UsdaCategorySelect()
  usdaCategorySelect.onchange = () =>
    foodFinderInput.setUsdaCategoryId(usdaCategorySelect.getSelected()!.id)

  const foodDetailsTable = FoodDetailsTable()

  function loadFoodDetails(foodId: number) {
    Promise
      .all([
        api('getIntakeMetadataForAllNutrients', { age: 25, gender: 'M' }),
        api('findFoodDetails', { id: foodId })
      ])
      .then(([intakeMetadata, foodDetailsData]) => {
        foodDetailsTable.setData(intakeMetadata, foodDetailsData)
      })
  }

  const foodFinderInput = FoodFinderInput()
  foodFinderInput.onSelect(loadFoodDetails)

  const controlsRow = Hbox([usdaCategorySelect, foodFinderInput], { gap: '8px' })

  const root = document.createElement('div')
  root.style.margin = '12px 16px'
  root.append(controlsRow, foodDetailsTable)

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId)
  }

  return root
}
