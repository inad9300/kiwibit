import { pct } from '../utils/pct'

export function getNutrientPctBg(
  im: { rdi?: number, ul?: number } | undefined,
  nutrient: { amount: number }
) {
  if (im?.ul != null || im?.rdi != null) {
    if (im.ul != null && nutrient.amount >= im.ul) {
      return `linear-gradient(90deg, rgba(150, 0, 0, 0.15) 100%, transparent 0)`
    } else if (im.rdi != null && im.ul == null && pct(nutrient.amount, im.rdi) > 100) {
      return `linear-gradient(90deg, rgba(240, 240, 0, 0.15) 100%, transparent 0)`
    } else if (im.rdi != null && (im.ul != null || pct(nutrient.amount, im.rdi) <= 100)) {
      return `linear-gradient(90deg, rgba(0, 150, 0, 0.15) ${pct(nutrient.amount, im.rdi)}%, transparent 0)`
    }
  }
  return ''
}
