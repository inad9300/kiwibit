import { Page } from '../pages'
import { Html } from '../components/Html'
import { Link } from '../components/Link'
import { tooltip } from '../main'
import { Hbox } from '../components/Box'
import { Spacer } from '../components/Spacer'
import type { ApiOutput } from '../utils/api'
import { CategoryCircle } from '../top-foods/CategoryCircle'
import { IntakeMetadataTooltip } from './IntakeMetadataTooltip'
import { getNutrientPctBg } from './getNutrientPctBg'
import { NonNull } from '../utils/NonNull'
import { Icon } from '../components/Icon'

export function FoodDetailsTable() {
  const title = Html('h1').with(it => {
    it.style.margin = '0'
    it.style.whiteSpace = 'nowrap'
    it.style.overflow = 'hidden'
    it.style.textOverflow = 'ellipsis'
    it.style.fontWeight = 'normal'
    it.style.fontSize = 'inherit'
    it.style.color = '#000'
  })

  const categoryCircle = CategoryCircle('transparent', 12).with(it => {
    it.style.marginTop = '4px'
  })

  const ddgLink = Link('').with(it => {
    it.target = '_blank'
    it.style.lineHeight = '0'
    it.style.marginTop = '2px'

    it.onmouseenter = () => img.style.opacity = '1'
    it.onmouseleave = () => img.style.opacity = '0.5'

    const img = Icon('images').with(it => {
      it.style.fontSize = '15px'
      it.style.opacity = '0.5'
    })

    tooltip.attach('Find images in DuckDuckGo', it)

    it.append(img)
  })

  const heading = Hbox().with(it => {
    it.style.marginBottom = '3px'
    it.style.fontSize = '15px'
    const spacer = Spacer()
    it.setChildren([categoryCircle, title, spacer, ddgLink], '4px')
    spacer.style.margin = '0'
  })

  const tbody = Html('tbody').with(it => {
    it.style.fontSize = '14px'
  })

  const table = Html('table').with(it => {
    it.append(tbody)
    it.style.width = '100%'
    it.style.borderCollapse = 'collapse'
    it.style.border = '1px solid #ccc'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.marginBottom = '-1px'
  })

  const root = Html('div').with(it => {
    it.style.width = '335px'
    it.append(heading, table)

    return {
      setData(
        intakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'>,
        foodDetails: ApiOutput<'findFoodDetails'>,
        foodAmount: number
      ) {
        foodDetails = {
          ...foodDetails,
          nutrients: foodDetails.nutrients.map(nutrient => ({
            ...nutrient,
            amount: nutrient.amount === null ? null : parseFloat((foodAmount * nutrient.amount / 100).toFixed(3))
          }))
        }

        title.textContent = foodDetails.name
        tooltip.attach(foodDetails.name, title)

        categoryCircle.style.backgroundColor = foodDetails.food_category_color
        tooltip.attach(foodDetails.food_category_name, categoryCircle)

        ddgLink.href = 'https://duckduckgo.com/?iax=images&ia=images&q=' + encodeURIComponent(foodDetails.name)
        // googleImagesLink.href = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.name)

        const knownCategories: string[] = []
        const trs: HTMLTableRowElement[] = []

        for (let i = 0; i < foodDetails.nutrients.length; ++i) {
          const n = foodDetails.nutrients[i]
          const tr = Html('tr').with(it => {
            it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.75)'
          })

          if (!knownCategories.includes(n.category_name)) {
            knownCategories.push(n.category_name)

            const categoryCell = Html('td').with(it => {
              it.textContent = n.category_name
              it.colSpan = 3
              it.style.padding = '6px'
              it.style.fontWeight = 'bold'
              it.style.textAlign = 'center'
              it.style.textTransform = 'uppercase'
              it.style.fontSize = '13px'
              it.style.color = '#333'
              it.style.borderTop = it.style.borderBottom = '1px solid #ccc'
              it.style.backgroundColor = '#eee'
            })

            tr.append(categoryCell)
            trs.push(tr)
            i--
            continue
          }

          const nutrientCell = Html('td').with(it => {
            it.append(
              Link(`?page=${Page.TopFoods}&nutrient-id=${n.id}`).with(it => {
                it.textContent = n.name + (n.alias ? ' / ' + n.alias : '')
              })
            )
          })

          const amountCell = Html('td').with(it => {
            it.textContent = n.amount === null ? '—' : n.amount + ' ' + n.unit_abbr
            it.style.textAlign = 'right'
            it.style.whiteSpace = 'nowrap'
            it.style.borderRight = '1px solid #ccc'
          })

          const im = intakeMetadata.find(im => im.nutrient_id === n.id)
          if (n.amount !== null) {
            tr.style.backgroundImage = getNutrientPctBg(im, n as NonNull<typeof n>)
            tooltip.attach(IntakeMetadataTooltip(im, n as NonNull<typeof n>), tr)
          }

          const cells = [nutrientCell, amountCell]
          cells.forEach(td => (td.style.padding = '6px'))

          tr.append(...cells)
          trs.push(tr)
        }

        tbody.innerHTML = ''
        tbody.append(...trs)
      }
    }
  })

  return root
}
