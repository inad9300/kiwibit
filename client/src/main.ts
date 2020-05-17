import './polyfills'
import { App } from './App'
import { log } from './utils/log'

window.addEventListener('error', evt => log.error('Uncaught exception.', evt))
window.addEventListener('unhandledRejection', evt => log.error('Unhandled rejection.', evt))

if (DEBUG) {
  const { createElement } = document

  document.createElement = function () {
    const elem = createElement.apply(document, arguments as any)

    elem.dataset.stack = new Error().stack!
      .split('\n')
      .map(l => l.trim())
      .filter(l => /^at Object.[a-zA-Z0-9_]+/.test(l))
      .map(l => l.slice(10, l.indexOf(' ', 10)))
      .join(' ← ')

    return elem
  }
}

document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'

export const app = App()
document.body.append(app)
