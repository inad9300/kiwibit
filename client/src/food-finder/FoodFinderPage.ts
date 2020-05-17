import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { api } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox } from '../components/Box'
import { Html } from '../components/Html'
import { RegularButton } from '../components/RegularButton'

export function FoodFinderPage() {
  const usdaCategorySelect = UsdaCategorySelect().with(it => {
    it.onchange = () => foodFinderInput.setUsdaCategoryId(it.getSelected()!.id)
  })

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

  const showAllNutrientsBtn = RegularButton('Show more nutrients').with(it => {
    it.style.width = 'auto'
    it.onclick = () => loadFoodDetails(lastFoodId, !lastShowAll)
  })

  const foodFinderInput = FoodFinderInput().with(it => {
    it.onSelect = foodId => loadFoodDetails(foodId, false)
  })

  const controlsRow = Hbox().with(it => {
    it.setChildren([usdaCategorySelect, foodFinderInput], '8px')
  })

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId, false)
  }

  return Html('div').with(it => {
    it.style.margin = '12px 16px'
    it.append(controlsRow, foodDetailsTable, showAllNutrientsBtn)
  })
}
