import { Page } from '../pages'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'
import { pct } from '../utils/pct'
import { tooltip } from '../App'
import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { Abbr } from '../components/Abbr'
import { Spacer } from '../components/Spacer'

const barPadding = 17
const barTitleRightMargin = 8

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

function Bar(f: FoodNutrient, max: number) {
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

function BarTooltipContent(f: FoodNutrient) {
  const nameRow = Html('div').with(it => {
    it.textContent = f.name
  })

  const categoryCircle = CategoryCircle(f.color).with(it => {
    it.style.marginTop = '2px'
  })

  const categoryName = Html('div').with(it => {
    it.textContent = f.usda_category_name
    it.style.fontStyle = 'italic'
  })

  const categoryRow = Hbox().with(it => {
    it.setChildren([categoryCircle, categoryName], '4px')
  })

  const amountRow = Html('div').with(it => {
    it.textContent = `${f.amount} ${f.unit_abbr}`
    it.style.fontWeight = 'bold'
  })

  return Vbox().with(it => {
    it.setChildren([nameRow, categoryRow, amountRow], '3px')
  })
}

function CategoryCircle(color: string) {
  return Html('div').with(it => {
    it.style.width = it.style.height = it.style.borderRadius = '11px'
    it.style.backgroundColor = color
  })
}

function MetadataLine(width: string, color: string) {
  return Html('div').with(it => {
    it.style.height = '100%'
    it.style.position = 'absolute'
    it.style.top = '0'
    it.style.left = '0'
    it.style.width = width
    it.style.borderRight = `1px solid ${color}`
  })
}

function Legend(intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
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

function Span(text: string) {
  return Html('span').with(it => {
    it.textContent = text
  })
}
