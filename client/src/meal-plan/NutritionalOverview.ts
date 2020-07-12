import { Html } from '../components/Html'
import { Vbox } from '../components/Box'
import { NutrientGroupTitle } from './NutrientGroupTitle'
import { NutrientRow } from './NutrientRow'
import { groupBy } from '../utils/groupBy'
import { ApiOutput } from '../utils/api'

export function NutritionalOverview() {
  return Html('div').with(it => {
    it.style.maxWidth = 'max-content'
    it.style.margin = '16px'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'

    const nutrientRows: { [nutrientId: number]: ReturnType<typeof NutrientRow> } = {}

    return {
      nutrientRows,
      initialize(
        userNutrients: ApiOutput<'getAllNutrients'>,
        intakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'>
      ) {
        const groupedNutrients = groupBy(userNutrients, 'category')

        Object.keys(groupedNutrients).forEach(groupName => {
          const groupContent = Html('div').with(it => {
            it.style.height = '452px'
            it.style.overflowY = 'auto'
            it.style.fontSize = '14px'
            it.style.border = '1px solid #ccc'
            it.style.backgroundColor = '#fff'
          })

          groupedNutrients[groupName].forEach(n => {
            const nutrientRow = NutrientRow(0, n, intakeMetadata.find(im => im.nutrient_id === n.id))
            nutrientRows[n.id] = nutrientRow
            groupContent.append(nutrientRow)
          })

          it.append(
            Vbox().with(it => {
              it.style.float = 'left'
              it.style.marginRight = '-1px'
              it.append(NutrientGroupTitle(groupName), groupContent)
            })
          )
        })
      },
      reset() {
        Object
          .values(nutrientRows)
          .forEach(row => row.setAmount(0))
      }
    } as const
  })
}
