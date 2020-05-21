import { NutrientSelect } from './NutrientSelect'
import { PerSelect } from './PerSelect'
import { CategorySelect } from './CategorySelect'
import { TopFoodsChart } from './TopFoodsChart'
import { api, ApiInput } from '../utils/api'
import { getUrlParams } from '../utils/getUrlParams'
import { Html } from '../components/Html'
import { Hbox, Vbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'
import { barPadding } from './BarRow'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'

export function TopFoodsPage() {
  const nutrientSelect = NutrientSelect().with(it => {
    const urlNutrientId = getUrlParams().get('nutrient-id')

    it.onchange = () => reloadChart(it.getSelected()!.id)
    it.onReady = () => {
      if (!urlNutrientId) {
        reloadChart(it.getSelected()!.id)
      } else {
        const nutrientId = parseInt(urlNutrientId, 10)
        it.setSelected(nutrientId)
        reloadChart(nutrientId)
      }
    }
  })

  const categorySelect = CategorySelect().with(it => {
    it.onchange = () => reloadChart(nutrientSelect.getSelected()!.id)
  })

  const perSelect = PerSelect().with(it => {
    it.onchange = () => reloadChart(nutrientSelect.getSelected()!.id)
  })

  const zoomTitle = Html('div').with(it => {
    it.textContent = 'Zoom'
    it.style.fontSize = '13px'
    it.style.fontWeight = 'bold'
    it.style.color = '#555'
    it.style.margin = '0 0 5px 4px'
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
    it.style.margin = '12px 16px'
  })

  const chart = TopFoodsChart()

  const moreResultsBtn = RegularButton('More results').with(it => {
    it.hidden = true
    it.style.width = 'auto'
    it.style.margin = `0 ${barPadding}px 12px ${barPadding}px`
    it.onclick = () => {
      topFoodsOffset += 100
      reloadChart(nutrientSelect.getSelected()!.id, topFoodsOffset)
    }
  })

  let topFoodsOffset = 0
  let lastTopFoodsCriteria: ApiInput<'getTopFoodsForNutrient'>
  let lastIntakeMetadata: NutrientIntakeMetadata
  const topFoodsAcc: FoodNutrient[] = []

  async function reloadChart(nutrientId: number, offset = 0) {
    if (offset > 0) {
      const topFoods = await api('getTopFoodsForNutrient', { ...lastTopFoodsCriteria, offset })
      topFoodsAcc.push(...topFoods)
      chart.update(lastIntakeMetadata, topFoodsAcc)
      return
    }

    chart.style.width = ''
    topFoodsOffset = 0

    const categoryId = categorySelect.getSelected()?.id

    lastTopFoodsCriteria = {
      nutrientId,
      orderBy: perSelect.getSelected()!.value,
      categories: !categoryId || categoryId === -1 ? [] : [categoryId],
      offset
    }

    const [intakeMetadata, topFoods] = await Promise.all([
      api('getIntakeMetadataForNutrient', { nutrientId, age: 25, gender: 'M' }),
      api('getTopFoodsForNutrient', lastTopFoodsCriteria)
    ])

    lastIntakeMetadata = intakeMetadata
    topFoodsAcc.length = 0
    topFoodsAcc.push(...topFoods)
    chart.update(intakeMetadata, topFoods)
    moreResultsBtn.hidden = false

    zoomSlider.step = zoomSlider.min = zoomSlider.value = chart.clientWidth + ''
    zoomSlider.max = (chart.clientWidth * 10) + ''
  }

  return Vbox().with(it => {
    it.append(controlsRow, chart, moreResultsBtn)
  })
}
