import { pct } from '../shared/pct'

/**
 * TODO Overall percentage of nutrients covered by 100 grams of this food.
 */
export function FoodDetails() {
  const heading = document.createElement('h1')

  const googleImagesLink = document.createElement('a')
  googleImagesLink.target = '_blank'
  googleImagesLink.textContent = 'Find in Google Images'

  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'

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
  thead.style.borderBottom = '1px solid grey'
  thead.append(tr)

  const tbody = document.createElement('tbody')
  table.append(thead, tbody)

  const root = document.createElement('div')
  root.append(heading, googleImagesLink, table)

  return Object.assign(root, {
    setData(intakeMetadata: any[], foodDetails: any) {
      heading.textContent = foodDetails.name + ` (100 g)`

      googleImagesLink.href = googleImagesLink.href =
        'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.name)

      const trs = (foodDetails.nutrients as any[])
        .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))
        .map((n: any, idx) => {
          const im = intakeMetadata.find(im => im.nutrient_id === n.id)

          const tr = document.createElement('tr')
          tr.style.backgroundColor = idx % 2 === 0 ? '' : 'lightgrey'

          const nameTd = document.createElement('td')
          nameTd.textContent = n.name + (n.alias ? ' / ' + n.alias : '')

          const amountTd = document.createElement('td')
          amountTd.textContent = n.amount + ' ' + n.unit_abbr
          amountTd.style.textAlign = 'right'

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

          tds.forEach(td => (td.style.padding = '4px 6px'))

          tr.append(...tds)

          return tr
        })

      tbody.innerHTML = ''
      tbody.append(...trs)
    }
  })
}
