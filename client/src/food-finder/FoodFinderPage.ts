import { UsdaCategorySelect } from './UsdaCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { api } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox, Vbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'

export function FoodFinderPage() {
  const usdaCategorySelect = UsdaCategorySelect().with(it => {
    it.onchange = () => foodFinderInput.setUsdaCategoryId(it.getSelected()!.id)
  })

  const foodDetailsTable = FoodDetailsTable().with(it => {
    it.hidden = true
  })

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
        showMoreNutrientsBtn.textContent = showAll ? 'Show less nutrients' : 'Show more nutrients'
        foodDetailsTable.setData(intakeMetadata, foodDetailsData)
        foodDetailsTable.hidden = showMoreNutrientsBtn.hidden = false
      })
  }

  const showMoreNutrientsBtn = RegularButton('Show more nutrients').with(it => {
    it.hidden = true
    it.style.width = '335px'
    it.style.borderColor = '#ccc'
    it.onclick = () => loadFoodDetails(lastFoodId, !lastShowAll)
  })

  const foodFinderInput = FoodFinderInput().with(it => {
    it.onSelect = food => loadFoodDetails(food.id, false)
  })

  const controlsRow = Hbox().with(it => {
    it.append(usdaCategorySelect, foodFinderInput)
    it.style.marginBottom = '10px'
    it.style.minHeight = 'min-content'
  })

  const foodIdStr = getUrlParams().get('food-id')
  if (foodIdStr) {
    const foodId = parseInt(foodIdStr, 10)
    loadFoodDetails(foodId, false)
  }

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px 16px'
    it.append(controlsRow, foodDetailsTable, showMoreNutrientsBtn)
  })
}
