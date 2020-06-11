import { Page } from '../pages'
import { api } from '../utils/api'
import { FoodCategorySelect } from '../top-foods/FoodCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox, Vbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'

function urlFoodId() {
  const foodIdStr = getUrlParams().get('food-id')
  return foodIdStr ? parseInt(foodIdStr, 10) : null
}

export function FoodFinderPage() {
  const foodCategorySelect = FoodCategorySelect().with(it => {
    it.onchange = () => foodFinderInput.setUsdaCategoryId(it.getSelected()!.id)
  })

  const foodDetailsTable = FoodDetailsTable().with(it => {
    it.hidden = true
  })

  let lastFoodId: number
  let lastShowAll: boolean

  async function loadFoodDetails(foodId: number, showAll: boolean) {
    const [intakeMetadata, foodDetailsData] = await Promise.all([
      api('getIntakeMetadataForAllNutrients', { age: 25, gender: 'M' }),
      api('findFoodDetails', { id: foodId, showAll })
    ])

    lastFoodId = foodId
    lastShowAll = showAll
    showMoreNutrientsBtn.textContent = showAll ? 'Show less nutrients' : 'Show more nutrients'
    foodDetailsTable.setData(intakeMetadata, foodDetailsData, 100)
    foodDetailsTable.hidden = showMoreNutrientsBtn.hidden = false
  }

  const showMoreNutrientsBtn = RegularButton('Show more nutrients').with(it => {
    it.hidden = true
    it.style.width = '335px'
    it.style.borderColor = '#ccc'
    it.onclick = () => loadFoodDetails(lastFoodId, !lastShowAll)
  })

  const foodFinderInput = FoodFinderInput().with(it => {
    it.onSelect = async food => {
      await loadFoodDetails(food.id, false)
      if (urlFoodId() !== food.id) {
        history.pushState(null, '', `/?page=${Page.FoodFinder}&food-id=${food.id}`)
      }
    }
  })

  const controlsRow = Hbox().with(it => {
    it.append(foodCategorySelect, foodFinderInput)
    it.style.marginBottom = '10px'
    it.style.minHeight = 'min-content'
  })

  function loadFoodDetailsFromUrl() {
    const foodId = urlFoodId()
    if (foodId) {
      loadFoodDetails(foodId, false)
    } else {
      foodDetailsTable.hidden = showMoreNutrientsBtn.hidden = true
    }
  }

  loadFoodDetailsFromUrl()
  window.addEventListener('popstate', () => loadFoodDetailsFromUrl())

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(controlsRow, foodDetailsTable, showMoreNutrientsBtn)
  })
}
