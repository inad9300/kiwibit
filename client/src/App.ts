import { getCurrentPage } from './pages'
import { Header } from './header/Header'
import { Html } from './components/Html'
import { Tooltip } from './components/Tooltip'

export const tooltip = Tooltip()

export function App() {
  const appStyle = Html('style').with(it => {
    it.textContent = `
      .kiwibit * {
        box-sizing: border-box;
      }

      .kiwibit ::-moz-focus-inner {
        border: 0;
      }
    `
  })

  const page = getCurrentPage()
  const pageComponent = page.component()
  pageComponent.style.flex = '1'

  document.title = page.title

  let i = 1
  const titleSuffix = ' meals'

  function slidingTitle() {
    document.title = page.title + ' |' + titleSuffix.slice(-i)

    if (++i <= titleSuffix.length) {
      requestAnimationFrame(slidingTitle)
    }
  }

  setTimeout(() => {
    document.title += ' |'

    setTimeout(() => requestAnimationFrame(slidingTitle), 128)
  }, 1_024)

  return Html('div').with(it => {
    it.className = 'kiwibit'
    it.style.height = '100%'
    it.style.display = 'flex'
    it.style.flexDirection = 'column'
    it.style.position = 'relative'
    it.style.fontFamily = 'sans-serif'
    it.append(appStyle, Header(), pageComponent, tooltip)
  })
}
