import { Page } from '../pages'
import { api, ApiOutput } from '../utils/api'
import { FoodCategorySelect } from '../top-foods/FoodCategorySelect'
import { FoodFinderInput } from './FoodFinderInput'
import { FoodDetailsTable } from './FoodDetailsTable'
import { getUrlParams } from '../utils/getUrlParams'
import { Hbox, Vbox } from '../components/Box'
import { fetchSettings } from '../settings/SettingsApi'
import { updateUrl } from '../utils/updateUrl'
import { TextField } from '../components/TextField'
import { ControlTitle } from '../components/ControlTitle'
import { toInt } from '../utils/toInt'

function urlFoodId() {
  const idStr = getUrlParams().get('food-id')
  return idStr ? toInt(idStr) : ''
}

export function FoodFinderPage() {
  const foodCategorySelect = FoodCategorySelect().with(it => {
    fetchSettings().then(({ food_categories }) => {
      foodFinderInput.setUsdaCategoryIds(food_categories)

      it.onchange = () => {
        const selectedCategory = it.getSelected()!.id
        foodFinderInput.setUsdaCategoryIds(selectedCategory === -1 ? food_categories : [selectedCategory])
      }
    })
  })

  const foodFinderInput = FoodFinderInput().with(it => {
    it.onSelect = async food => {
      await loadFoodDetails(food.id)
      if (urlFoodId() !== food.id) {
        updateUrl(Page.FoodFinder, { 'food-id': food.id })
      }
    }
  })

  let lastIntakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'>
  let lastFoodDetails: ApiOutput<'findFoodDetails'>

  const gramsInput = TextField().with(it => {
    it.type = 'number'
    it.min = '0'
    it.max = '9999'
    it.value = '100'
    it.style.minWidth = '80px'

    it.oninput = () => {
      const value = parseFloat(it.value)
      if (!isNaN(value)) {
        if (value < 0) {
          it.value = '0'
        } else if (value > 9999) {
          it.value = '9999'
        } else {
          foodDetailsTable.setData(lastIntakeMetadata, lastFoodDetails, value)
        }
      }
    }
  })

  const controlsRow = Hbox().with(it => {
    it.append(
      foodCategorySelect,
      foodFinderInput,
      Vbox().with(it => {
        it.style.marginLeft = '8px'
        it.append(ControlTitle('Grams'), gramsInput)
      })
    )
    it.style.marginBottom = '10px'
    it.style.minHeight = 'min-content'
  })

  const foodDetailsTable = FoodDetailsTable().with(it => {
    it.hidden = true
  })

  async function loadFoodDetails(foodId: number) {
    const { age, sex, nutrients } = await fetchSettings()

    const [intakeMetadata, foodDetails] = await Promise.all([
      api('getIntakeMetadataForAllNutrients', { age, gender: sex }, { cache: true }),
      api('findFoodDetails', { id: foodId, nutrients }, { cache: true })
    ])

    lastIntakeMetadata = intakeMetadata
    lastFoodDetails = foodDetails

    foodDetailsTable.setData(intakeMetadata, foodDetails, 100)
    foodDetailsTable.hidden = false
  }

  function loadFoodDetailsFromUrl() {
    const foodId = urlFoodId()
    if (foodId) {
      loadFoodDetails(foodId)
    } else {
      foodDetailsTable.hidden = true
    }
  }

  loadFoodDetailsFromUrl()
  window.addEventListener('popstate', () => loadFoodDetailsFromUrl())

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(controlsRow, foodDetailsTable)
  })
}
