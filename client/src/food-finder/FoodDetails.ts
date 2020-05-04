import { pct } from '../utils/pct'

export function FoodDetails() {
  const heading = document.createElement('h1')

  const googleImagesLink = document.createElement('a')
  googleImagesLink.target = '_blank'
  googleImagesLink.textContent = 'Find in Google Images'

  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  table.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  table.style.marginBottom = '16px'

  const headers = ['Nutrient', 'Amount', 'RDI', '% of RDI', 'UL', '% of UL']

  const ths = headers.map(h => {
    const th = document.createElement('th')
    th.textContent = h
    th.style.padding = '4px 6px'
    return th
  })

  const tr = document.createElement('tr')
  tr.append(...ths)

  const thead = document.createElement('thead')
  thead.append(tr)

  const tbody = document.createElement('tbody')
  table.append(thead, tbody)

  const root = document.createElement('div')
  root.append(heading, googleImagesLink, table)

  return Object.assign(root, {
    setData(intakeMetadata: any[], foodDetails: any) {
      heading.textContent = foodDetails.name + ` (100 g)`
      googleImagesLink.href = 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.name)

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
          categoryTd.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'

          tr.append(categoryTd)
          trs.push(tr)
          i--
          continue
        }

        const nameTd = document.createElement('td')
        nameTd.textContent = n.name + (n.alias ? ' / ' + n.alias : '')

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

        const tds = [nameTd, amountTd, rdiTd, rdiPctTd, ulTd, ulPctTd]
        tds.forEach(td => (td.style.padding = '6px'))

        tr.append(...tds)
        trs.push(tr)
      }

      tbody.innerHTML = ''
      tbody.append(...trs)
    }
  })
}
