import { getCurrentPage } from './pages'
import { Header } from './header/Header'
import { tooltip } from './components/tooltip'

export function App() {
  const appStyle = document.createElement('style')
  appStyle.textContent = `
    .kiwibit * {
      box-sizing: border-box;
    }

    ::-moz-focus-inner {
      border: 0;
    }
  `

  const page = getCurrentPage()
  const pageComponent = page.component()
  pageComponent.style.flex = '1'

  const root = document.createElement('div')
  root.className = 'kiwibit'
  root.style.height = '100%'
  root.style.display = 'flex'
  root.style.flexDirection = 'column'
  root.style.position = 'relative'
  root.style.fontFamily = 'sans-serif'

  root.append(appStyle, Header(), pageComponent, tooltip)

  document.title = page.title

  setTimeout(() => {
    document.title += ' |'

    setTimeout(() => {
      const titleSuffix = ' meals'
      let i = 1

      const intervalId = setInterval(() => {
        document.title = page.title + ' |' + titleSuffix.slice(-i)
        i++
        if (i > titleSuffix.length) {
          clearInterval(intervalId)
        }
      }, 16)
    }, 64)
  }, 1_000)

  return root
}
