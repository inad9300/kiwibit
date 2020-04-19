import { NutrientSelect } from './NutrientSelect'
import { OrderBySelect } from './OrderBySelect'
import { TopFoodsChart } from './TopFoodsChart'
import { api } from '../shared/api'

export function TopFoodsPage() {
  const chart = TopFoodsChart()

  function reloadChart() {
    const nutrientId = parseInt(_nutrientSelect.value, 10)

    Promise.all([
      api('getIntakeMetadataForNutrient', {
        nutrientId,
        age: 25,
        gender: 'M'
      }),
      api('getTopFoodsForNutrient', {
        nutrientId,
        orderBy: _orderBySelect.value as 'weight' | 'energy'
      })
    ]).then(([intakeMetadata, topFoods]) => {
      chart.setData(intakeMetadata, topFoods)
    })
  }

  const _nutrientSelect = NutrientSelect()
  _nutrientSelect.onchange = reloadChart

  const _orderBySelect = OrderBySelect()
  _orderBySelect.onchange = reloadChart

  const root = document.createElement('div')
  root.style.margin = '20px'
  root.append(_nutrientSelect, _orderBySelect, chart)

  return root
}
