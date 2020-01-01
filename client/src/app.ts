import { pages } from './pages'
import { header } from './header/header'
import { footer } from './shared/footer'
import { getUrlParams } from './shared/getUrlParams'

export function app() {
  const appStyle = document.createElement('style')
  appStyle.textContent = `
    .kiwibit * {
      box-sizing: border-box;
    }
  `

  const pageSlug = getUrlParams().get('page')

  const page = pages.hasOwnProperty(pageSlug!)
    ? pages[pageSlug as keyof typeof pages]
    : pages['not-found']

  const pageElem = page.element()
  pageElem.style.flex = '1'

  const root = document.createElement('div')
  root.className = 'kiwibit'
  root.style.height = '100%'
  root.style.display = 'flex'
  root.style.flexDirection = 'column'
  root.style.position = 'relative'
  root.style.fontFamily = 'sans-serif'
  root.append(appStyle, header(), pageElem, footer())

  document.title = page.title + ' | Kiwibit'

  return root
}
