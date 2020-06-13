import './polyfills'
import { log } from './utils/log'
import { getCurrentPage } from './pages'
import { Style } from './components/Style'
import { Header } from './header/Header'
import { Tooltip } from './components/Tooltip'

window.addEventListener('error', evt => log.error('Uncaught exception.', evt))
window.addEventListener('unhandledRejection', evt => log.error('Unhandled rejection.', evt))

const page = getCurrentPage()

const globalCss = Style(`
  * {
    box-sizing: border-box;
  }

  ::-moz-focus-inner {
    border: 0;
  }
`)

export const tooltip = Tooltip()

document.title = page.title
document.documentElement.style.height = '100%'
document.body.with(it => {
  it.style.height = '100%'
  it.style.display = 'flex'
  it.style.flexDirection = 'column'
  it.style.margin = '0'
  it.style.fontFamily = 'system-ui, sans-serif'
  it.append(
    globalCss,
    Header(),
    page.component().with(it => { it.style.flex = '1' }),
    tooltip
  )
})

if (navigator.userAgent.includes('Firefox')) {
  let i = 1
  const slidingTitle = () => {
    document.title = page.title + ' |' + ' meals'.slice(-i)
    if (++i <= 6) {
      requestAnimationFrame(slidingTitle)
    }
  }

  setTimeout(() => {
    document.title += ' |'
    setTimeout(() => requestAnimationFrame(slidingTitle), 128)
  }, 1_024)
} else {
  setTimeout(() => {
    document.title += ' | meals'
  }, 1_024)
}
