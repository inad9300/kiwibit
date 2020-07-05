import { Page } from '../pages'
import { pct } from '../utils/pct'
import { tooltip } from '../main'
import { Spacer } from '../components/Spacer'
import { Html } from '../components/Html'
import { Hbox } from '../components/Box'
import { BarTooltipContent } from './BarTooltipContent'
import type { ApiOutput } from '../utils/api'

export const barPadding = 12
export const barTitleRightMargin = 8

export function BarRow(food: ApiOutput<'getTopFoodsForNutrient'>[0], max: number) {
  const title = Html('div').with(it => {
    it.textContent = food.name
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
    it.style.width = pct(food.amount, max) + '%'
    it.style.backgroundColor = food.color
  })

  const barSpacer = Spacer().with(it => {
    it.append(bar)
  })

  return Hbox('a').with(it => {
    it.append(title, barSpacer)
    ;(it as any as HTMLAnchorElement).href = `?page=${Page.FoodFinder}&food-id=${food.id}`
    it.style.textDecoration = 'none'
    it.style.outline = '0'
    it.style.padding = `2px ${barPadding}px`
    it.onmouseenter = () => it.style.backgroundColor = '#d2e3f2'
    it.onmouseleave = () => it.style.backgroundColor = 'transparent'
    tooltip.attach(BarTooltipContent(food), it)

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
