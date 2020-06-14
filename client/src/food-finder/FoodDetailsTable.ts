import { pct } from '../utils/pct'
import { Page } from '../pages'
import { Html } from '../components/Html'
import { Link } from '../components/Link'
import { Image } from '../components/Image'
import { tooltip } from '../main'
import { Span } from '../components/Span'
import { Vbox, Hbox } from '../components/Box'
import { Italics } from '../components/Italics'
import { Spacer } from '../components/Spacer'
import type { ApiOutput } from '../utils/api'
import { CategoryCircle } from '../top-foods/CategoryCircle'

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

    it.onmouseenter = () => img.style.filter = ''
    it.onmouseleave = () => img.style.filter = 'grayscale(100%)'

    const img = Image('https://duckduckgo.com/assets/common/dax-logo.svg').with(it => {
      it.width = it.height = 16
      it.style.filter = 'grayscale(100%)'
    })

    tooltip.attach(Span('Find images in DuckDuckGo'), it)

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
            amount: parseFloat((foodAmount * nutrient.amount / 100).toFixed(3))
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
                it.style.color = 'black'
                it.style.textDecoration = 'none'
              })
            )
          })

          const amountCell = Html('td').with(it => {
            it.textContent = n.amount + ' ' + n.unit_abbr
            it.style.textAlign = 'right'
            it.style.whiteSpace = 'nowrap'
            it.style.borderRight = '1px solid #ccc'
          })

          const im = intakeMetadata.find(im => im.nutrient_id === n.id)

          if (im?.ul != null || im?.rdi != null) {
            if (im.ul != null && n.amount >= im.ul) {
              tr.style.backgroundImage = `linear-gradient(90deg, rgba(150, 0, 0, 0.15) 100%, transparent 0)`
            } else if (im.rdi != null && (im.ul != null || pct(n.amount, im.rdi) <= 100)) {
              tr.style.backgroundImage = `linear-gradient(90deg, rgba(0, 150, 0, 0.15) ${pct(n.amount, im.rdi)}%, transparent 0)`
            }
          }

          const imTooltip = Vbox().with(it => {
            it.setChildren([
              im?.rdi
                ? Span(`${pct(n.amount, im.rdi).toFixed(2)} % of the RDI (${im.rdi} ${n.unit_abbr})`)
                : Italics('No RDI information'),
              im?.ul
                ? Span(`${pct(n.amount, im.ul).toFixed(2)} % of the UL (${im.ul} ${n.unit_abbr})`)
                : Italics('No UL information')
            ], '4px')
          })

          tooltip.attach(imTooltip, tr)

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
