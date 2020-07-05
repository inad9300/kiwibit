import { Vbox } from '../components/Box'
import { Span } from '../components/Span'
import { Italics } from '../components/Italics'
import { pct } from '../utils/pct'

export function IntakeMetadataTooltip(
  im: { rdi?: number, ul?: number } | undefined,
  nutrient: { amount: number, unit_abbr: string }
) {
  return Vbox().with(it => {
    it.setChildren([
      im?.rdi
        ? Span(`${pct(nutrient.amount, im.rdi).toFixed(2)} % of the RDI (${im.rdi} ${nutrient.unit_abbr})`)
        : Italics('No RDI information'),
      im?.ul
        ? Span(`${pct(nutrient.amount, im.ul).toFixed(2)} % of the UL (${im.ul} ${nutrient.unit_abbr})`)
        : Italics('No UL information')
    ], '4px')
  })
}
