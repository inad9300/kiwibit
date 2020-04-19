import './polyfills'
import { App } from './App'
import { log } from './shared/log'
import { debug } from './shared/debug'

window.addEventListener('error', evt => log.error('Uncaught exception.', evt))
window.addEventListener('unhandledRejection', evt => log.error('Unhandled rejection.', evt))

if (debug) {
  const { createElement } = document

  document.createElement = function () {
    const elem = createElement.apply(document, arguments as any)

    const callee = new Error().stack!.split('\n')[1].split('@')[0]
    elem.dataset.type = callee

    return elem
  } as any
}

document.documentElement.style.height = '100%'

document.body.style.height = '100%'
document.body.style.margin = '0'

export const app = App()

document.body.append(app)
