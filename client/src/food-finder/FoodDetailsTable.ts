import { pct } from '../utils/pct'
import { Page } from '../pages'
import { Html } from '../components/Html'
import { Link } from '../components/Link'
import { Image } from '../components/Image'
import { Icon } from '../components/Icon'
import { ApiOutput } from '../utils/api'
import { tooltip } from '../App'
import { Span } from '../components/Span'
import { Vbox, Hbox } from '../components/Box'
import { Italics } from '../components/Italics'
import { Spacer } from '../components/Spacer'

export function FoodDetailsTable() {
  const title = Html('h1').with(it => {
    it.style.color = '#000'
    it.style.fontWeight = 'normal'
    it.style.fontSize = '15px'
    it.style.margin = '0'
  })

  const ddgLink = Link('').with(it => {
    it.target = '_blank'
    it.style.lineHeight = '0'

    it.onmouseenter = () => img.style.filter = ''
    it.onmouseleave = () => img.style.filter = 'grayscale(100%)'

    const img = Image('https://duckduckgo.com/assets/common/dax-logo.svg').with(it => {
      it.width = it.height = 18
      it.style.filter = 'grayscale(100%)'
    })

    tooltip.update(Span('Find images in DuckDuckGo'), it)

    it.append(img)
  })

  const heading = Hbox().with(it => {
    it.style.margin = '0 3px 3px 3px'
    it.setChildren([
      title,
      Spacer(),
      Vbox().with(it => {
        it.append(Spacer(), ddgLink)
      })
    ], '3px')
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

  return Html('div').with(it => {
    it.style.width = '325px'
    it.append(heading, table)

    return {
      setData(intakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'>, foodDetails: ApiOutput<'findFoodDetails'>) {
        title.textContent = foodDetails.name + ` (100 g)`
        tooltip.update(Span(foodDetails.name + ` (100 g)`), title)

        ddgLink.href = 'https://duckduckgo.com/?iax=images&ia=images&q=' + encodeURIComponent(foodDetails.name)
        // googleImagesLink.href = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.name)

        const knownCategories: string[] = []
        const trs: HTMLTableRowElement[] = []

        for (let i = 0; i < foodDetails.nutrients.length; ++i) {
          const n = foodDetails.nutrients[i]
          const tr = Html('tr')

          if (!knownCategories.includes(n.category_name)) {
            knownCategories.push(n.category_name)

            const categoryTd = Html('td').with(it => {
              it.textContent = n.category_name
              it.colSpan = 3
              it.style.padding = '6px'
              it.style.fontWeight = 'bold'
              it.style.textAlign = 'center'
              it.style.textTransform = 'uppercase'
              it.style.fontSize = '13px'
              it.style.color = '#333'
              it.style.borderTop = it.style.borderBottom = '1px solid #ccc'
              it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.75)'
              it.style.backgroundColor = '#eee'
            })

            tr.append(categoryTd)
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
          })

          const iconCell = Html('td').with(it => {
            const im = intakeMetadata.find(im => im.nutrient_id === n.id)
            if (im?.ul || im?.rdi) {
              let icon: SVGElement
              if (im.ul && n.amount >= im.ul) {
                icon = Icon('times').with(it => {
                  it.style.color = '#cc1515'
                })
              } else if (im.rdi && im.ul) {
                icon = Icon('check').with(it => {
                  it.style.color = 'green'
                  it.style.opacity = Math.min(1, pct(n.amount, im.rdi!) / 100) + ''
                })
              } else {
                icon = Icon('circle').with(it => {
                  it.style.fontSize = '9px'
                  it.style.marginLeft = '2px'
                  it.style.color = '#cad1f0'
                })
              }

              const imTooltip = Vbox().with(it => {
                it.setChildren([
                  im.rdi
                    ? Span(`${pct(n.amount, im.rdi).toFixed(2)} % of the RDI (${im.rdi} ${n.unit_abbr})`)
                    : Italics('No RDI information'),
                  im.ul
                    ? Span(`${pct(n.amount, im.ul).toFixed(2)} % of the UL (${im.ul} ${n.unit_abbr})`)
                    : Italics('No UL information')
                ], '4px')
              })

              tooltip.update(imTooltip, it)

              it.append(icon)
            }
          })

          const cells = [nutrientCell, amountCell, iconCell]
          cells.forEach(td => (td.style.padding = '6px'))

          tr.append(...cells)
          trs.push(tr)
        }

        tbody.innerHTML = ''
        tbody.append(...trs)
      }
    }
  })
}
