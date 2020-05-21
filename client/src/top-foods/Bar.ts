import { Page } from '../pages'
import { pct } from '../utils/pct'
import { tooltip } from '../App'
import { Spacer } from '../components/Spacer'
import { Html } from '../components/Html'
import { Hbox } from '../components/Box'
import { BarTooltipContent } from './BarTooltipContent'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'

export const barPadding = 17
export const barTitleRightMargin = 8

export function Bar(f: FoodNutrient, max: number) {
  const title = Html('div').with(it => {
    it.textContent = f.name
    it.style.whiteSpace = 'nowrap'
    it.style.overflow = 'hidden'
    it.style.textOverflow = 'ellipsis'
    it.style.textAlign = 'right'
    it.style.marginRight = barTitleRightMargin + 'px'
    it.style.color = '#111'
    it.style.fontSize = '13px'
  })

  const bar = Html('div').with(it => {
    it.style.height = '100%'
    it.style.width = pct(f.amount, max) + '%'
    it.style.backgroundColor = f.color
  })

  const barSpacer = Spacer().with(it => {
    it.append(bar)
  })

  return Hbox('a').with(it => {
    it.append(title, barSpacer)
    ;(it as any as HTMLAnchorElement).href = `?page=${Page.FoodFinder}&food-id=${f.id}`
    it.style.textDecoration = 'none'
    it.style.outline = '0'
    it.style.padding = `2px ${barPadding}px`
    it.onmouseenter = () => it.style.backgroundColor = '#d2e3f2'
    it.onmouseleave = () => it.style.backgroundColor = 'transparent'
    tooltip.update(BarTooltipContent(f), it)

    return {
      getTitleWidth() {
        return title.clientWidth
      },
      setTitleWidth(w: number) {
        title.style.width = w + 'px'
      }
    }
  })
}
