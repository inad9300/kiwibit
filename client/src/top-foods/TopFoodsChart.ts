import { Page } from '../pages'
import type { FoodNutrient } from '../../../server/src/api/getTopFoodsForNutrient'
import type { NutrientIntakeMetadata } from '../../../server/src/api/getIntakeMetadataForNutrient'
import { Vbox, Hbox } from '../components/Box'
import { pct } from '../utils/pct'
import { attachTooltip } from '../components/tooltip'
import { Abbr } from '../components/Abbr'

const barPadding = 17
const barTitleRightMargin = 8

export function TopFoodsChart() {
  const root = document.createElement('div')
  root.style.marginBottom = '12px'
  root.style.position = 'relative'

  return Object.assign(root, {
    update(intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
      const max = Math.max(
        intakeMetadata.rdi ?? 0,
        intakeMetadata.ul ?? 0,
        ...topFoods.map(f => f.amount)
      )

      const bars = topFoods.map(f => Bar(f, max))

      root.innerHTML = ''
      root.append(Vbox(bars), Legend(intakeMetadata, topFoods))

      const widths = bars.map(b => b.getTitleWidth())
      const width = Math.min(Math.max(...widths), 250)
      bars.forEach(b => b.setTitleWidth(width))

      const { rdi, ul } = intakeMetadata
      if (rdi || ul) {
        const boxOverBars = document.createElement('div')
        boxOverBars.style.pointerEvents = 'none'
        boxOverBars.style.width = `calc(100% - ${(barPadding * 2) + width + barTitleRightMargin}px)`
        boxOverBars.style.height = '100%'
        boxOverBars.style.position = 'absolute'
        boxOverBars.style.top = '0'
        boxOverBars.style.right = barPadding + 'px'

        if (rdi) boxOverBars.append(MetadataLine(pct(rdi, max) + '%', 'green'))
        if (ul) boxOverBars.append(MetadataLine(pct(ul, max) + '%', 'red'))

        root.append(boxOverBars)
      }
    }
  })
}

function Bar(f: FoodNutrient, max: number) {
  const title = document.createElement('div')
  title.textContent = f.name
  title.style.whiteSpace = 'nowrap'
  title.style.overflow = 'hidden'
  title.style.textOverflow = 'ellipsis'
  title.style.textAlign = 'right'
  title.style.marginRight = barTitleRightMargin + 'px'
  title.style.color = '#111'
  title.style.fontSize = '13px'

  const barSpace = document.createElement('div')
  barSpace.style.flex = '1'

  const bar = document.createElement('div')
  bar.style.height = '100%'
  bar.style.width = pct(f.amount, max) + '%'
  bar.style.backgroundColor = f.color

  barSpace.append(bar)

  const root = Hbox([title, barSpace], { tag: 'a' })
  ;(root as HTMLAnchorElement).href = `?page=${Page.FoodFinder}&food-id=${f.id}`
  root.style.textDecoration = 'none'
  root.style.outline = '0'
  root.style.padding = `2px ${barPadding}px`
  root.onmouseenter = () => root.style.backgroundColor = '#d2e3f2'
  root.onmouseleave = () => root.style.backgroundColor = 'transparent'
  attachTooltip(BarTooltipContent(f), root)

  return Object.assign(root, {
    getTitleWidth() {
      return title.clientWidth
    },
    setTitleWidth(w: number) {
      title.style.width = w + 'px'
    }
  })
}

function BarTooltipContent(f: FoodNutrient) {
  const nameRow = document.createElement('div')
  nameRow.textContent = f.name

  const categoryCircle = CategoryCircle(f.color)
  categoryCircle.style.marginTop = '2px'

  const categoryName = document.createElement('div')
  categoryName.textContent = f.usda_category_name
  categoryName.style.fontStyle = 'italic'

  const categoryRow = Hbox([categoryCircle, categoryName], { gap: '4px '})

  const amountRow = document.createElement('div')
  amountRow.textContent = `${f.amount} ${f.unit_abbr}`
  amountRow.style.fontWeight = 'bold'

  return Vbox([nameRow, categoryRow, amountRow], { gap: '3px' })
}

function CategoryCircle(color: string) {
  const root = document.createElement('div')
  root.style.width =
    root.style.height =
      root.style.borderRadius = '11px'
  root.style.backgroundColor = color
  return root
}

function MetadataLine(width: string, color: string) {
  const root = document.createElement('div')
  root.style.height = '100%'
  root.style.position = 'absolute'
  root.style.top = '0'
  root.style.left = '0'
  root.style.width = width
  root.style.borderRight = `1px solid ${color}`
  return root
}

function Legend(intakeMetadata: NutrientIntakeMetadata, topFoods: FoodNutrient[]) {
  const { rdi, ul } = intakeMetadata
  const { unit_abbr } = topFoods[0]
  const metadataLegendItems: HTMLElement[] = []

  if (rdi) {
    const rdiLegendLine = document.createElement('div')
    rdiLegendLine.style.height = '1px'
    rdiLegendLine.style.width = '11px'
    rdiLegendLine.style.marginTop = '7px'
    rdiLegendLine.style.backgroundColor = 'green'

    const rdiLegendItem = Hbox([
      rdiLegendLine,
      Abbr(`RDI `, 'Reference Daily Intake'),
      Span(`(${rdi} ${unit_abbr})`)
    ], { gap: '4px' })

    metadataLegendItems.push(rdiLegendItem)
  }

  if (ul) {
    const ulLegendLine = document.createElement('div')
    ulLegendLine.style.height = '1px'
    ulLegendLine.style.width = '11px'
    ulLegendLine.style.marginTop = '7px'
    ulLegendLine.style.backgroundColor = 'red'

    const ulLegendItem = Hbox([
      ulLegendLine,
      Abbr(`UL`, 'Tolerable Upper Intake Level'),
      Span(`(${ul} ${unit_abbr})`)
    ], { gap: '4px' })

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
      return Hbox([categoryCircle, Span(f.usda_category_name)], { gap: '4px' })
    })

  const root = Vbox([...metadataLegendItems, ...categoryLegendItems], { gap: '4px' })
  root.style.position = 'fixed'
  root.style.zIndex = '1'
  root.style.width =
    root.style.maxHeight = '230px'
  root.style.overflowY = 'auto'
  root.style.bottom =
    root.style.right = '12px'
  root.style.padding = '8px'
  root.style.fontSize = '13px'
  root.style.border = '1px solid lightgrey'
  root.style.background = '#fff'
  root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'

  return root
}

function Span(text: string) {
  const root = document.createElement('span')
  root.textContent = text
  return root
}
