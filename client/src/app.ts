import './polyfills'
import {pages} from './pages'

export function app(pageSlug: string | null) {
    const appStyle = document.createElement('style')
    appStyle.textContent = `.kiwibit * { box-sizing: border-box; }`

    let page = pages[pageSlug as keyof typeof pages]
    if (!pageSlug)
        page = pages['home']
    else if (!page)
        page = pages['not-found']

    const pageElem = page.render()
    pageElem.style.minHeight = '100%'

    const root = document.createElement('div')
    root.className = 'kiwibit'
    root.style.height = '100%'
    root.style.fontFamily = 'sans-serif'
    root.style.position = 'relative'
    root.append(appStyle, pageElem)

    // FIXME?
    document.title = page.title + ' @ Kiwibit'

    return root
}
