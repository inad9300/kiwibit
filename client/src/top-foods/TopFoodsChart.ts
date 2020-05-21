import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'
import { pct } from '../utils/pct'
import { Html } from '../components/Html'
import { Vbox } from '../components/Box'
import { Legend } from './Legend'
import { Bar, barPadding, barTitleRightMargin } from './Bar'
import { MetadataLine } from './MetadataLine'

export function TopFoodsChart() {
  return Html('div').with(it => {
    it.style.marginBottom = '12px'
    it.style.position = 'relative'

    return {
      update(intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
        const max = Math.max(
          intakeMetadata.rdi ?? 0,
          intakeMetadata.ul ?? 0,
          ...topFoods.map(f => f.amount)
        )

        const bars = topFoods.map(f => Bar(f, max))

        it.innerHTML = ''
        it.append(
          Vbox().with(it => {
            it.append(...bars)
          }),
          Legend(intakeMetadata, topFoods)
        )

        const widths = bars.map(b => b.getTitleWidth())
        const width = Math.min(Math.max(...widths), 250)
        bars.forEach(b => b.setTitleWidth(width))

        const { rdi, ul } = intakeMetadata
        if (rdi || ul) {
          const boxOverBars = Html('div').with(it => {
            it.style.pointerEvents = 'none'
            it.style.width = `calc(100% - ${(barPadding * 2) + width + barTitleRightMargin}px)`
            it.style.height = '100%'
            it.style.position = 'absolute'
            it.style.top = '0'
            it.style.right = barPadding + 'px'

            if (rdi) it.append(MetadataLine(pct(rdi, max) + '%', 'green'))
            if (ul) it.append(MetadataLine(pct(ul, max) + '%', 'red'))
          })

          it.append(boxOverBars)
        }
      }
    }
  })
}
