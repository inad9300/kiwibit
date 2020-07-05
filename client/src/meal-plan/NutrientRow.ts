import { Span } from '../components/Span'
import { Hbox, } from '../components/Box'
import { Spacer } from '../components/Spacer'
import { Link } from '../components/Link'
import { IntakeMetadataTooltip } from '../food-finder/IntakeMetadataTooltip'
import { getNutrientPctBg } from '../food-finder/getNutrientPctBg'
import { tooltip } from '../main'
import { Page } from '../pages'
import { ApiOutput } from '../utils/api'

export function NutrientRow(
  initialAmount: number,
  nutrient: ApiOutput<'getAllNutrients'>[0],
  im: ApiOutput<'getIntakeMetadataForAllNutrients'>[0] | undefined
) {
  const amountBox = Span('' + initialAmount)

  return Hbox().with(it => {
    it.style.padding = '6px 8px'
    it.append(
      Link(`?page=${Page.TopFoods}&nutrient-id=${nutrient.id}`).with(it => {
        it.textContent = nutrient.name + (nutrient.alias ? ' / ' + nutrient.alias : '')
      }),
      Spacer().with(it => {
        it.style.minWidth = '32px'
      }),
      amountBox,
      ' ' + nutrient.unit_abbr
    )

    return {
      setAmount(amount: number) {
        amountBox.textContent = '' + amount.toFixed(1)

        it.style.backgroundImage = getNutrientPctBg(im, { amount })
        tooltip.attach(IntakeMetadataTooltip(im, { ...nutrient, amount }), it)
      }
    }
  })
}
