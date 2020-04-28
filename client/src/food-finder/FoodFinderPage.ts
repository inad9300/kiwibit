import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetails } from './FoodDetails'
import { api } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox } from '../components/Box'

export function FoodFinderPage() {
  const usdaCategorySelect = UsdaCategorySelect()
  usdaCategorySelect.onchange = () => {
    foodFinderInput.setUsdaCategoryId(usdaCategorySelect.getSelected()!.id)
  }

  const foodDetails = FoodDetails()

  function loadFoodDetails(foodId: number) {
    Promise.all([
      api('getIntakeMetadataForAllNutrients', { age: 25, gender: 'M' }),
      api('findFoodDetails', { id: foodId })
    ]).then(([intakeMetadata, foodDetailsData]) => {
      foodDetails.setData(intakeMetadata, foodDetailsData)
    })
  }

  const foodFinderInput = FoodFinderInput(loadFoodDetails)

  const controlsRow = Hbox([usdaCategorySelect, foodFinderInput], { gap: '8px' })

  const root = document.createElement('div')
  root.style.margin = '12px 16px'
  root.append(controlsRow, foodDetails)

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId)
  }

  return root
}
