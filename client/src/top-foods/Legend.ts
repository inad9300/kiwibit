import { Html } from '../components/Html'
import { Abbr } from '../components/Abbr'
import { Span } from '../components/Span'
import { Hbox } from '../components/Box'
import { Card } from '../components/Card'
import { CategoryCircle } from './CategoryCircle'
import { barPadding } from './BarRow'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'

export function Legend(parentChart: HTMLElement, intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
  const { rdi, ul } = intakeMetadata
  const { unit_abbr } = topFoods[0]
  const metadataLegendItems: HTMLElement[] = []

  if (rdi) {
    const rdiLegendItem = Hbox().with(it => {
      it.setChildren(
        [
          Html('div').with(it => {
            it.style.height = '1px'
            it.style.width = '11px'
            it.style.marginTop = '7px'
            it.style.backgroundColor = 'green'
          }),
          Abbr(`RDI `, 'Reference Daily Intake'),
          Span(`(${rdi} ${unit_abbr})`)
        ],
        '4px'
      )
    })

    metadataLegendItems.push(rdiLegendItem)
  }

  if (ul) {
    const ulLegendItem = Hbox().with(it => {
      it.setChildren(
        [
          Html('div').with(it => {
            it.style.height = '1px'
            it.style.width = '11px'
            it.style.marginTop = '7px'
            it.style.backgroundColor = 'red'
          }),
          Abbr(`UL`, 'Tolerable Upper Intake Level'),
          Span(`(${ul} ${unit_abbr})`)
        ],
        '4px'
      )
    })

    metadataLegendItems.push(ulLegendItem)
  }

  const visitedCategories: string[] = []
  const categoryLegendItems = topFoods
    .filter(f => {
      if (!visitedCategories.includes(f.usda_category_name)) {
        visitedCategories.push(f.usda_category_name)
        return true
      }
      return false
    })
    .map(f => {
      const categoryCircle = CategoryCircle(f.color)
      categoryCircle.style.marginTop = '2px'
      return Hbox().with(it => {
        it.setChildren([categoryCircle, Span(f.usda_category_name)], '4px')
      })
    })

  return Card().with(it => {
    it.setChildren([...metadataLegendItems, ...categoryLegendItems], '4px')
    it.style.position = 'fixed'
    it.style.zIndex = '1'
    it.style.top = '0'
    it.style.right = barPadding + 'px'
    it.style.width = it.style.maxHeight = '230px'
    it.style.overflowY = 'auto'
    it.style.fontSize = '13px'

    // TODO? Remove previous event listeners.

    setTimeout(() => {
      const legendHeight = it.offsetHeight
      const { documentElement } = document

      function reposition() {
        const chartBottom = parentChart.getBoundingClientRect().bottom
        const chartBottomOffset = Math.max(0, documentElement.offsetHeight - (chartBottom + 12))
        it.style.top = documentElement.offsetHeight - legendHeight - chartBottomOffset - 12 + 'px'
      }

      reposition()
      window.addEventListener('resize', reposition)
      window.addEventListener('scroll', reposition)
    })
  })
}
