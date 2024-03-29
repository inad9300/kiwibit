import { Page } from '../pages'
import { api, ApiInput, ApiOutput } from '../utils/api'
import { NutrientSelect } from './NutrientSelect'
import { PerSelect } from './PerSelect'
import { FoodCategorySelect } from './FoodCategorySelect'
import { TopFoodsChart } from './TopFoodsChart'
import { getUrlParams } from '../utils/getUrlParams'
import { Html } from '../components/Html'
import { Hbox, Vbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'
import { barPadding } from './BarRow'
import { ControlTitle } from '../components/ControlTitle'
import { fetchAgeAndSexSettings, fetchFoodCategoriesSettings } from '../settings/SettingsApi'
import { updateUrl } from '../utils/updateUrl'
import { toInt } from '../utils/toInt'

function urlNutrientId() {
  const idStr = getUrlParams().get('nutrient-id')
  return idStr ? toInt(idStr) : ''
}

function urlFoodCategoryId() {
  const idStr = getUrlParams().get('food-category-id')
  return idStr ? toInt(idStr) : -1
}

function urlPer() {
  return getUrlParams().get('per') || 'weight' as 'weight' | 'energy'
}

function roundAmount(foods: ApiOutput<'getTopFoodsForNutrient'>) {
  return foods.map(f => {
    f.amount = parseFloat(f.amount.toFixed(3))
    return f
  })
}

export function TopFoodsPage() {
  const nutrientSelect = NutrientSelect().with(it => {
    it.onchange = () => reloadChart()
  })

  const foodCategorySelect = FoodCategorySelect().with(it => {
    it.onchange = () => reloadChart()
  })

  const perSelect = PerSelect().with(it => {
    it.onchange = () => reloadChart()
  })

  function loadFromUrl() {
    nutrientSelect.setSelected(urlNutrientId())
    foodCategorySelect.setSelected(urlFoodCategoryId())
    perSelect.setSelected(urlPer())

    reloadChart()
  }

  Promise.all([nutrientSelect.promise, foodCategorySelect.promise]).then(() => loadFromUrl())
  window.addEventListener('popstate', () => loadFromUrl())

  const zoomTitle = ControlTitle('Zoom').with(it => {
    it.style.marginBottom = '5px'
  })

  const zoomSlider = Html('input').with(it => {
    it.type = 'range'
    it.min = it.max = '0'
    it.oninput = () => chart.style.width = it.value + 'px'
  })

  const zoomControl = Vbox().with(it => {
    it.append(zoomTitle, zoomSlider)
  })

  const controlsRow = Hbox().with(it => {
    it.setChildren([nutrientSelect, foodCategorySelect, perSelect, zoomControl], '8px')
    it.style.minHeight = 'min-content'
    it.style.margin = '12px 16px'
  })

  const chart = TopFoodsChart(nutrientSelect)

  const topFoodsLimit = 100
  let topFoodsOffset = 0

  const moreResultsBtn = RegularButton('More results').with(it => {
    it.hidden = true
    it.style.width = 'auto'
    it.style.margin = `0 ${barPadding}px`
    it.onclick = () => {
      topFoodsOffset += topFoodsLimit
      reloadChart(topFoodsOffset)
    }
  })

  const topFoodsAcc: ApiOutput<'getTopFoodsForNutrient'> = []
  let lastTopFoodsCriteria: ApiInput<'getTopFoodsForNutrient'>
  let lastIntakeMetadata: ApiOutput<'getIntakeMetadataForNutrient'>

  async function reloadChart(offset = 0) {
    const nutrientId = nutrientSelect.getSelected()?.id || ''
    const categoryId = foodCategorySelect.getSelected()?.id
    const per = perSelect.getSelected()!.value

    if (urlNutrientId() !== nutrientId || urlFoodCategoryId() !== categoryId || urlPer() !== per) {
      updateUrl(Page.TopFoods, {
        'nutrient-id': nutrientId,
        'food-category-id': categoryId === -1 ? '' : categoryId,
        'per': per
      })
    }

    if (!nutrientId) {
      chart.update({ rdi: 0, ul: 0 }, [])
      moreResultsBtn.hidden = true
      return
    }

    if (offset > 0) {
      const topFoods = await api('getTopFoodsForNutrient', { ...lastTopFoodsCriteria, offset }).then(roundAmount)
      if (topFoods.length < topFoodsLimit || topFoods.slice(-1)[0].amount === 0) {
        moreResultsBtn.hidden = true
      }
      topFoodsAcc.push(...topFoods)
      chart.update(lastIntakeMetadata, topFoodsAcc)
      return
    }

    chart.style.width = ''
    topFoodsOffset = 0

    const userCategories = await fetchFoodCategoriesSettings(await foodCategorySelect.promise)

    lastTopFoodsCriteria = {
      limit: topFoodsLimit,
      nutrientId,
      per,
      categories: !categoryId || categoryId === -1 ? userCategories : [categoryId],
      offset
    }

    const { age, sex } = await fetchAgeAndSexSettings()

    const [intakeMetadata, topFoods] = await Promise.all([
      api('getIntakeMetadataForNutrient', { nutrientId, age, gender: sex }),
      api('getTopFoodsForNutrient', lastTopFoodsCriteria).then(roundAmount)
    ])

    lastIntakeMetadata = intakeMetadata
    topFoodsAcc.length = 0
    topFoodsAcc.push(...topFoods)
    chart.update(intakeMetadata, topFoods)
    if (topFoods.length === 0) {
      moreResultsBtn.hidden = true
    } else if (topFoods.length === topFoodsLimit && topFoods.slice(-1)[0].amount !== 0) {
      moreResultsBtn.hidden = false
    }

    zoomSlider.step = zoomSlider.min = zoomSlider.value = chart.clientWidth + ''
    zoomSlider.max = (chart.clientWidth * 10) + ''
  }

  return Vbox().with(it => {
    it.append(controlsRow, chart, moreResultsBtn)
    it.style.paddingBottom = '12px'
  })
}
