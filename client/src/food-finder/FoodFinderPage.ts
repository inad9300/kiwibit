import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetails } from './FoodDetails'
import { api } from '../shared/api'
import { getUrlParams } from '../shared/getUrlParams'

export function FoodFinderPage() {
  const _usdaCategorySelect = UsdaCategorySelect()
  _usdaCategorySelect.onchange = () => {
    _foodFinderInput.setUsdaCategoryId(parseInt(_usdaCategorySelect.value, 10))
  }

  const _foodDetails = FoodDetails()

  function loadFoodDetails(foodId: number) {
    Promise.all([
      api('getIntakeMetadataForAllNutrients', { age: 25, gender: 'M' }),
      api('findFoodDetails', { id: foodId })
    ]).then(([intakeMetadata, foodDetails]) => {
      _foodDetails.setData(intakeMetadata, foodDetails)
    })
  }

  const _foodFinderInput = FoodFinderInput(loadFoodDetails)

  const root = document.createElement('div')
  root.style.margin = '20px'
  root.append(_usdaCategorySelect, _foodFinderInput, _foodDetails)

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId)
  }

  return root
}
