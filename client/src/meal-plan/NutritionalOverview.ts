import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { NutrientGroupTitle } from './NutrientGroupTitle'
import { NutrientRow } from './NutrientRow'
import { groupBy } from '../utils/groupBy'
import { ApiOutput } from '../utils/api'
import { toInt } from '../utils/toInt'

export function NutritionalOverview() {
  return Hbox().with(it => {
    it.style.margin = '16px'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'

    function resizeChildren() {
      const { width } = it.getBoundingClientRect()
      const children = Array.from(it.children) as HTMLElement[]
      const childWidths = children.map(child => child.getBoundingClientRect().width)
      const childrenWidth = childWidths.reduce((acc, val) => acc + val, 0)
      const childIncrement = (width - childrenWidth) / children.length
      children.forEach((child, idx) =>
        child.style.width = (childWidths[idx] + childIncrement) + 'px'
      )
    }

    const nutrientRows: { [nutrientId: number]: ReturnType<typeof NutrientRow> } = {}

    return {
      initialize(
        userNutrients: ApiOutput<'getAllNutrients'>,
        intakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'>
      ) {
        const groupedNutrients = groupBy(userNutrients, 'category')

        it.append(
          ...Object.keys(groupedNutrients).map((groupName, idx) =>
            Vbox().with(it => {
              it.style.display = 'inline-flex'
              it.append(
                NutrientGroupTitle(groupName).with(it => {
                  it.style.borderTop = it.style.borderRight = it.style.borderBottom = '1px solid #ccc'
                  it.style.borderLeft = idx === 0 ? '1px solid #ccc' : ''
                }),
                Html('div').with(it => {
                  it.style.height = '452px'
                  it.style.overflowY = 'auto'
                  it.style.fontSize = '14px'
                  it.style.borderRight = it.style.borderBottom = '1px solid #ccc'
                  it.style.borderLeft = idx === 0 ? '1px solid #ccc' : ''
                  it.style.backgroundColor = '#fff'

                  groupedNutrients[groupName].forEach(n => {
                    const nutrientRow = NutrientRow(0, n, intakeMetadata.find(im => im.nutrient_id === n.id))
                    nutrientRows[n.id] = nutrientRow
                    it.append(nutrientRow)
                  })
                })
              )
            })
          )
        )

        resizeChildren()
        window.addEventListener('resize', () => resizeChildren())
      },
      setAmounts(nutrientAmounts: { [nutrientId: number]: number }) {
        Object.keys(nutrientAmounts).map(toInt).forEach(nutrientId =>
          nutrientRows[nutrientId].setAmount(nutrientAmounts[nutrientId])
        )
        resizeChildren()
      },
      reset() {
        Object
          .values(nutrientRows)
          .forEach(row => row.setAmount(0))
      }
    }
  })
}
