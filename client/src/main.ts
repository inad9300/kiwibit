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
      .slice(1)
      .map(l => l.trim())
      .filter(l => !/[. ]Html /.test(l))
      .map(l => l.match(/^at (?:Object\.)?([A-Z][a-zA-Z0-9_]+) \(/)?.[1])
      .filter(l => l)
      .join(' ← ')

    return elem
  }
}

document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'

export const app = App()
document.body.append(app)
