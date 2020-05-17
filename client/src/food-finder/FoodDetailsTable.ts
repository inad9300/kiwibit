import { pct } from '../utils/pct'
import { Page } from '../pages'
import { Html } from '../components/Html'
import { Link } from '../components/Link'

export function FoodDetailsTable() {
  const heading = Html('h1').with(it => {
    it.style.fontSize = '20px'
  })

  const ddgLink = Link('').with(it => {
    it.target = '_blank'
    it.textContent = 'Find images in DuckDuckGo'
  })

  const headers = ['Nutrient', 'Amount', 'RDI', '% of RDI', 'UL', '% of UL']

  const ths = headers.map(h =>
    Html('th').with(it => {
      it.textContent = h
      it.style.padding = '6px'
      it.style.fontSize = '14px'
      it.style.color = '#222'
      it.style.textAlign = h === 'Nutrient' ? 'left' : 'right'
    })
  )

  const tr = Html('tr').with(it => {
    it.append(...ths)
  })

  const thead = Html('thead').with(it => {
    it.append(tr)
  })

  const tbody = Html('tbody').with(it => {
    it.style.fontSize = '15px'
  })

  const table = Html('table').with(it => {
    it.append(thead, tbody)
    it.style.borderCollapse = 'collapse'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.marginBottom = '16px'
  })

  return Html('div').with(it => {
    it.append(heading, ddgLink, table)

    return {
      setData(intakeMetadata: any[], foodDetails: any) {
        heading.textContent = foodDetails.name + ` (100 g)`
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
              it.colSpan = headers.length
              it.style.padding = '6px'
              it.style.fontWeight = 'bold'
              it.style.textAlign = 'center'
              it.style.textTransform = 'uppercase'
              it.style.fontSize = '13px'
              it.style.color = '#222'
              it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.75)'
              it.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
            })

            tr.append(categoryTd)
            trs.push(tr)
            i--
            continue
          }

          const nutrientLink = Link(`?page=${Page.TopFoods}&nutrient-id=${n.id}`).with(it => {
            it.textContent = n.name + (n.alias ? ' / ' + n.alias : '')
            it.style.color = 'black'
            it.style.textDecoration = 'none'
          })

          const nutrientTd = Html('td').with(it => {
            it.append(nutrientLink)
          })

          const amountTd = Html('td').with(it => {
            it.textContent = n.amount + ' ' + n.unit_abbr
            it.style.textAlign = 'right'
          })

          const im = intakeMetadata.find(im => im.nutrient_id === n.id)

          const rdiTd = Html('td').with(it => {
            it.textContent = im?.rdi ? im.rdi + ' ' + n.unit_abbr : ''
            it.style.textAlign = 'right'
          })

          const rdiPctTd = Html('td').with(it => {
            it.textContent = im?.rdi ? pct(n.amount, im.rdi).toFixed(2) + ' %' : ''
            it.style.textAlign = 'right'
            if (im?.rdi && pct(n.amount, im.rdi) > 100) {
              it.style.color = 'green'
            }
          })

          const ulTd = Html('td').with(it => {
            it.textContent = im?.ul ? im.ul + ' ' + n.unit_abbr : ''
            it.style.textAlign = 'right'
          })

          const ulPctTd = Html('td').with(it => {
            it.textContent = im?.ul ? pct(n.amount, im.ul).toFixed(2) + ' %' : ''
            it.style.textAlign = 'right'
            if (im?.ul && pct(n.amount, im.ul) > 100) {
              it.style.color = 'red'
            }
          })

          const tds = [nutrientTd, amountTd, rdiTd, rdiPctTd, ulTd, ulPctTd]
          tds.forEach(td => (td.style.padding = '6px'))

          tr.append(...tds)
          trs.push(tr)
        }

        tbody.innerHTML = ''
        tbody.append(...trs)
      }
    }
  })
}
