import { pct } from '../utils/pct'
import { Html } from '../components/Html'
import { Vbox } from '../components/Box'
import { Legend } from './Legend'
import { BarRow, barPadding, barTitleRightMargin } from './BarRow'
import { MetadataLine } from './MetadataLine'
import { Italics } from '../components/Italics'
import { NutrientSelect } from './NutrientSelect'
import type { ApiOutput } from '../utils/api'

export function TopFoodsChart(nutrientSelect: ReturnType<typeof NutrientSelect>) {
  return Html('div').with(it => {
    it.style.position = 'relative'

    return {
      update(
        intakeMetadata: ApiOutput<'getIntakeMetadataForNutrient'>,
        topFoods: ApiOutput<'getTopFoodsForNutrient'>
      ) {
        if (topFoods.length === 0) {
          it.innerHTML = ''
          it.style.flex = '1'
          it.style.marginBottom = '0'
          it.append(
            Html('div').with(it => {
              it.style.height = '100%'
              it.style.margin = '0 16px'
              it.style.backgroundColor = '#f5f5f5'
              it.append(
                Italics(`No data found for ${nutrientSelect.getSelected()?.name}.`).with(it => {
                  it.style.display = 'inline-block'
                  it.style.width = '100%'
                  it.style.position = 'absolute'
                  it.style.top = '50%'
                  it.style.transform = 'translateY(-50%)'
                  it.style.textAlign = 'center'
                  it.style.fontSize = '15px'
                  it.style.color = '#555'
                })
              )
            })
          )
          return
        }

        const max = Math.max(
          intakeMetadata.rdi ?? 0,
          intakeMetadata.ul ?? 0,
          ...topFoods.map(f => f.amount)
        )

        const barRows = topFoods.map(f => BarRow(f, max))
        const barRowsBox = Vbox().with(it => {
          it.append(...barRows)
        })

        it.innerHTML = ''
        it.style.flex = '0 1 auto'
        it.style.marginBottom = '12px'
        it.append(
          barRowsBox,
          Legend(it, intakeMetadata, topFoods)
        )

        const titleWith = Math.min(250, Math.max(...barRows.map(b => b.getTitleWidth())))
        barRows.forEach(b => b.setTitleWidth(titleWith))

        const { rdi, ul } = intakeMetadata
        if (rdi || ul) {
          const barsOverlay = Html('div').with(it => {
            it.style.pointerEvents = 'none'
            it.style.width = `calc(100% - ${(barPadding * 2) + titleWith + barTitleRightMargin}px)`
            it.style.height = '100%'
            it.style.position = 'absolute'
            it.style.top = '0'
            it.style.right = barPadding + 'px'

            if (rdi) it.append(MetadataLine(pct(rdi, max) + '%', 'green'))
            if (ul) it.append(MetadataLine(pct(ul, max) + '%', 'red'))
          })

          it.append(barsOverlay)
        }
      }
    }
  })
}
