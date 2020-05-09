import { pct } from '../utils/pct'
import { Page } from '../pages'
import { Link } from '../components/Link'

export function FoodDetailsTable() {
  const heading = document.createElement('h1')
  heading.style.fontSize = '20px'

  const ddgLink = document.createElement('a')
  ddgLink.target = '_blank'
  ddgLink.textContent = 'Find images in DuckDuckGo'

  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  table.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  table.style.marginBottom = '16px'

  const headers = ['Nutrient', 'Amount', 'RDI', '% of RDI', 'UL', '% of UL']

  const ths = headers.map(h => {
    const th = document.createElement('th')
    th.textContent = h
    th.style.padding = '6px'
    th.style.fontSize = '14px'
    th.style.color = '#222'
    th.style.textAlign = h === 'Nutrient' ? 'left' : 'right'
    return th
  })

  const tr = document.createElement('tr')
  tr.append(...ths)

  const thead = document.createElement('thead')
  thead.append(tr)

  const tbody = document.createElement('tbody')
  tbody.style.fontSize = '15px'
  table.append(thead, tbody)

  const root = document.createElement('div')
  root.append(heading, ddgLink, table)

  return Object.assign(root, {
    setData(intakeMetadata: any[], foodDetails: any) {
      heading.textContent = foodDetails.name + ` (100 g)`
      ddgLink.href = 'https://duckduckgo.com/?iax=images&ia=images&q=' + encodeURIComponent(foodDetails.name)
      // googleImagesLink.href = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.name)

      const knownCategories: string[] = []

      const trs: HTMLTableRowElement[] = []

      for (let i = 0; i < foodDetails.nutrients.length; ++i) {
        const n = foodDetails.nutrients[i]
        const tr = document.createElement('tr')

        if (!knownCategories.includes(n.category_name)) {
          knownCategories.push(n.category_name)

          const categoryTd = document.createElement('td')
          categoryTd.textContent = n.category_name
          categoryTd.colSpan = headers.length
          categoryTd.style.padding = '6px'
          categoryTd.style.fontWeight = 'bold'
          categoryTd.style.textAlign = 'center'
          categoryTd.style.textTransform = 'uppercase'
          categoryTd.style.fontSize = '13px'
          categoryTd.style.color = '#222'
          categoryTd.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.75)'
          categoryTd.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'

          tr.append(categoryTd)
          trs.push(tr)
          i--
          continue
        }

        const nutrientLink = Link(`?page=${Page.TopFoods}&nutrient-id=${n.id}`)
        nutrientLink.textContent = n.name + (n.alias ? ' / ' + n.alias : '')
        nutrientLink.style.color = 'black'
        nutrientLink.style.textDecoration = 'none'

        const nutrientTd = document.createElement('td')
        nutrientTd.append(nutrientLink)

        const amountTd = document.createElement('td')
        amountTd.textContent = n.amount + ' ' + n.unit_abbr
        amountTd.style.textAlign = 'right'

        const im = intakeMetadata.find(im => im.nutrient_id === n.id)

        const rdiTd = document.createElement('td')
        rdiTd.textContent = im?.rdi ? im.rdi + ' ' + n.unit_abbr : ''
        rdiTd.style.textAlign = 'right'

        const rdiPctTd = document.createElement('td')
        rdiPctTd.textContent = im?.rdi ? pct(n.amount, im.rdi).toFixed(2) + ' %' : ''
        rdiPctTd.style.textAlign = 'right'
        if (im?.rdi && pct(n.amount, im.rdi) > 100) {
          rdiPctTd.style.color = 'green'
        }

        const ulTd = document.createElement('td')
        ulTd.textContent = im?.ul ? im.ul + ' ' + n.unit_abbr : ''
        ulTd.style.textAlign = 'right'

        const ulPctTd = document.createElement('td')
        ulPctTd.textContent = im?.ul ? pct(n.amount, im.ul).toFixed(2) + ' %' : ''
        ulPctTd.style.textAlign = 'right'
        if (im?.ul && pct(n.amount, im.ul) > 100) {
          ulPctTd.style.color = 'red'
        }

        const tds = [nutrientTd, amountTd, rdiTd, rdiPctTd, ulTd, ulPctTd]
        tds.forEach(td => (td.style.padding = '6px'))

        tr.append(...tds)
        trs.push(tr)
      }

      tbody.innerHTML = ''
      tbody.append(...trs)
    }
  })
}
