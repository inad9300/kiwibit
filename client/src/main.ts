import './polyfills'
import { app } from './app'
import { log } from './log'
import { debug } from './debug'

window.addEventListener('error', evt => log.error('Uncaught exception.', evt))
window.addEventListener('unhandledRejection', evt => log.error('Unhandled rejection.', evt))

if (debug) {
  const { createElement } = document

  document.createElement = function() {
    const elem = createElement.apply(document, arguments as any)

    const callee = new Error().stack!.split('\n')[1].split('@')[0]
    elem.dataset.type = callee

    return elem
  } as any
}

document.documentElement.style.height = '100%'

document.body.style.height = '100%'
document.body.style.margin = '0'

const urlParams = new URLSearchParams(location.search)
export const appRoot = app(urlParams.get('page'))

document.body.append(appRoot)
