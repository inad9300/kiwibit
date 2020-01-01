import { nutrientSelect } from './nutrientSelect'
import { orderBySelect } from './orderBySelect'
import { topFoodsChart } from './topFoodsChart'
import { api } from '../shared/api'

export function topFoodsPage() {
  const chart = topFoodsChart()

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

  const _nutrientSelect = nutrientSelect()
  _nutrientSelect.onchange = reloadChart

  const _orderBySelect = orderBySelect()
  _orderBySelect.onchange = reloadChart

  const root = document.createElement('div')
  root.style.margin = '20px'
  root.append(_nutrientSelect, _orderBySelect, chart)

  return root
}
