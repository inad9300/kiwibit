import { Page } from '../pages'
import { api, ApiInput, ApiOutput } from '../utils/api'
import { NutrientSelect } from './NutrientSelect'
import { PerSelect } from './PerSelect'
import { CategorySelect } from './CategorySelect'
import { TopFoodsChart } from './TopFoodsChart'
import { getUrlParams } from '../utils/getUrlParams'
import { Html } from '../components/Html'
import { Hbox, Vbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'
import { barPadding } from './BarRow'
import { ControlTitle } from '../components/ControlTitle'

function urlNutrientId() {
  const nutrientIdStr = getUrlParams().get('nutrient-id')
  return nutrientIdStr ? parseInt(nutrientIdStr, 10) : null
}

function roundAmount(foods: ApiOutput<'getTopFoodsForNutrient'>) {
  return foods.map(f => {
    f.amount = parseFloat(f.amount.toFixed(3))
    return f
  })
}

export function TopFoodsPage() {
  window.addEventListener('popstate', () => {
    const nutrientId = urlNutrientId()
    if (nutrientId) {
      nutrientSelect.setSelected(nutrientId)
      reloadChart(nutrientId)
    }
  })

  const nutrientSelect = NutrientSelect().with(it => {
    it.onchange = () => reloadChart(it.getSelected()!.id)
    it.onReady = () => {
      const nutrientId = urlNutrientId() ?? it.getSelected()!.id
      it.setSelected(nutrientId)
      reloadChart(nutrientId)
    }
  })

  const categorySelect = CategorySelect().with(it => {
    it.onchange = () => reloadChart(nutrientSelect.getSelected()!.id)
  })

  const perSelect = PerSelect().with(it => {
    it.onchange = () => reloadChart(nutrientSelect.getSelected()!.id)
  })

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
    it.setChildren([nutrientSelect, categorySelect, perSelect, zoomControl], '8px')
    it.style.minHeight = 'min-content'
    it.style.margin = '12px 16px'
  })

  const chart = TopFoodsChart()

  const topFoodsLimit = 100
  let topFoodsOffset = 0

  const moreResultsBtn = RegularButton('More results').with(it => {
    it.hidden = true
    it.style.width = 'auto'
    it.style.margin = `0 ${barPadding}px`
    it.onclick = () => {
      topFoodsOffset += topFoodsLimit
      reloadChart(nutrientSelect.getSelected()!.id, topFoodsOffset)
    }
  })

  const topFoodsAcc: ApiOutput<'getTopFoodsForNutrient'> = []
  let lastTopFoodsCriteria: ApiInput<'getTopFoodsForNutrient'>
  let lastIntakeMetadata: ApiOutput<'getIntakeMetadataForNutrient'>

  async function reloadChart(nutrientId: number, offset = 0) {
    if (urlNutrientId() !== nutrientId) {
      history.pushState(null, '', `/?page=${Page.TopFoods}&nutrient-id=${nutrientId}`)
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

    const categoryId = categorySelect.getSelected()?.id

    lastTopFoodsCriteria = {
      limit: topFoodsLimit,
      nutrientId,
      orderBy: perSelect.getSelected()!.value,
      categories: !categoryId || categoryId === -1 ? [] : [categoryId],
      offset
    }

    const [intakeMetadata, topFoods] = await Promise.all([
      api('getIntakeMetadataForNutrient', { nutrientId, age: 25, gender: 'M' }),
      api('getTopFoodsForNutrient', lastTopFoodsCriteria).then(roundAmount)
    ])

    lastIntakeMetadata = intakeMetadata
    topFoodsAcc.length = 0
    topFoodsAcc.push(...topFoods)
    chart.update(intakeMetadata, topFoods)
    if (topFoods.length === topFoodsLimit && topFoods.slice(-1)[0].amount !== 0) {
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
