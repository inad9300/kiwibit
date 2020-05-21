import { Html } from '../components/Html'
import { Abbr } from '../components/Abbr'
import { Span } from '../components/Span'
import { Vbox, Hbox } from '../components/Box'
import { CategoryCircle } from './CategoryCircle'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'

export function Legend(intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
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

  return Vbox().with(it => {
    it.setChildren([...metadataLegendItems, ...categoryLegendItems], '4px')
    it.style.position = 'fixed'
    it.style.zIndex = '1'
    it.style.bottom = it.style.right = '12px'
    it.style.width = it.style.maxHeight = '230px'
    it.style.overflowY = 'auto'
    it.style.padding = '8px'
    it.style.fontSize = '13px'
    it.style.border = '1px solid lightgrey'
    it.style.background = '#fff'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  })
}
