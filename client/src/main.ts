import './polyfills'
import { App } from './App'
import { log } from './utils/log'

window.addEventListener('error', evt => log.error('Uncaught exception.', evt))
window.addEventListener('unhandledRejection', evt => log.error('Unhandled rejection.', evt))

if (DEBUG) {
  const { createElement } = document

  document.createElement = function () {
    const elem = createElement.apply(document, arguments as any)

    const callee = new Error().stack!.split('\n')[1].split('@')[0]
    elem.dataset.component = callee

    return elem
  }
}

document.documentElement.style.height = '100%'
document.body.style.height = '100%'
document.body.style.margin = '0'

export const app = App()
document.body.append(app)
