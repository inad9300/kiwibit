import { NutrientSelect } from './NutrientSelect'
import { PerSelect } from './PerSelect'
import { CategorySelect } from './CategorySelect'
import { TopFoodsChart } from './TopFoodsChart'
import { api, ApiInput } from '../utils/api'
import { Hbox, Vbox } from '../components/Box'
import { Button } from '../components/Button'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'

export function TopFoodsPage() {
  const nutrientSelect = NutrientSelect()
  nutrientSelect.onchange = () => reloadChart()
  nutrientSelect.onReady(reloadChart)

  const categorySelect = CategorySelect()
  categorySelect.onchange = () => reloadChart()

  const perSelect = PerSelect()
  perSelect.onchange = () => reloadChart()

  const zoomTitle = document.createElement('div')
  zoomTitle.textContent = 'Zoom'
  zoomTitle.style.fontSize = '13px'
  zoomTitle.style.fontWeight = 'bold'
  zoomTitle.style.color = '#555'
  zoomTitle.style.margin = '0 0 5px 4px'

  const zoomSlider = document.createElement('input')
  zoomSlider.type = 'range'
  zoomSlider.min =
    zoomSlider.max = '0'
  zoomSlider.oninput = () => chart.style.width = zoomSlider.value + 'px'

  const zoomControl = Vbox([zoomTitle, zoomSlider])

  const controlsRow = Hbox([nutrientSelect, categorySelect, perSelect, zoomControl], { gap: '8px' })
  controlsRow.style.margin = '12px 16px'

  const chart = TopFoodsChart()

  const moreResultsBtn = Button()
  moreResultsBtn.textContent = 'More results'
  moreResultsBtn.style.display = 'none'
  moreResultsBtn.style.padding = '4px 5px'
  moreResultsBtn.style.width = 'auto'
  moreResultsBtn.style.margin = '0 12px 12px 12px'
  moreResultsBtn.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  moreResultsBtn.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  moreResultsBtn.style.backgroundColor = '#fff'
  moreResultsBtn.onclick = () => {
    topFoodsOffset += 100
    reloadChart(topFoodsOffset)
  }

  const root = Vbox([controlsRow, chart, moreResultsBtn])

  let topFoodsOffset = 0
  let lastTopFoodsCriteria: ApiInput<'getTopFoodsForNutrient'>
  const topFoodsAcc: FoodNutrient[] = []

  let lastIntakeMetadata: NutrientIntakeMetadata

  async function reloadChart(offset = 0) {
    if (offset > 0) {
      const topFoods = await api('getTopFoodsForNutrient', {
        ...lastTopFoodsCriteria,
        offset
      })
      topFoodsAcc.push(...topFoods)
      chart.update(lastIntakeMetadata, topFoodsAcc)
      return
    }

    chart.style.width = ''
    topFoodsOffset = 0

    const nutrientId = nutrientSelect.getSelected()!.id!
    const categoryId = categorySelect.getSelected()?.id

    lastTopFoodsCriteria = {
      nutrientId,
      orderBy: perSelect.getSelected()!.value,
      categories: !categoryId || categoryId === -1 ? [] : [categoryId],
      offset
    }

    const [intakeMetadata, topFoods] = await Promise.all([
      api('getIntakeMetadataForNutrient', {
        nutrientId,
        age: 25,
        gender: 'M'
      }),
      api('getTopFoodsForNutrient', lastTopFoodsCriteria)
    ])

    lastIntakeMetadata = intakeMetadata
    topFoodsAcc.length = 0
    topFoodsAcc.push(...topFoods)
    chart.update(intakeMetadata, topFoods)
    moreResultsBtn.style.display = 'block'

    zoomSlider.step =
      zoomSlider.min =
        zoomSlider.value = chart.clientWidth + ''
    zoomSlider.max = (chart.clientWidth * 10) + ''
  }

  return root
}
