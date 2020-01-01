import { pages } from '../pages'
import { list } from '../shared/list'

const findablePages = [pages['top-foods'], pages['food-finder'], pages['meal-plan']]

export function pageFinderInput() {
  const input = document.createElement('input')
  input.style.backgroundColor = '#eee'
  input.style.border = 'none'
  input.style.borderRadius = '3px'
  input.style.padding = '8px 12px'
  input.style.fontSize = '18px'
  input.style.minWidth = '250px'
  input.onfocus = () => pagesList.style.display = 'block'
  // input.onblur = () => pagesList.style.display = 'none'
  input.oninput = () => {
    pageItems.forEach(pi => pi.style.opacity = '100%')

    if (input.value) {
      pageItems.forEach(pi => {
        if (pi.textContent!.toLowerCase()!.indexOf(input.value) === -1) {
          pi.style.opacity = '25%'
        }
      })
    }
  }

  const pageItems = findablePages.map(p => {
    const a = document.createElement('a')
    a.style.textDecoration = 'none'
    a.textContent = p.title
    a.href = '/?page=' + p.slug

    const li = document.createElement('li')
    li.append(a)

    return li
  })

  const pagesList = list()
  pagesList.style.display = 'none'
  pagesList.style.padding = '12px'
  pagesList.style.backgroundColor = 'white'
  pagesList.style.minWidth = '100%'
  pagesList.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.5)'
  pagesList.style.position = 'absolute'
  pagesList.style.zIndex = '10'
  pagesList.style.top = '48px'
  pagesList.append(...pageItems)

  const root = document.createElement('div')
  root.style.position = 'relative'

  root.append(input, pagesList)

  return root
}
