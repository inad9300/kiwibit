import {html} from './html'
import {pages} from './pages'

export function app() {
    const root = html('div')
    {
        root.className = 'kiwibit'
        root.style.height = '100%'
        root.style.fontFamily = 'sans-serif'
    }

    return Object.assign(root, {
        goTo(pageSlug: string | null) {
            let page = pages[pageSlug as keyof typeof pages]

            if (!pageSlug) {
                page = pages['home']
            } else if (!page) {
                page = pages['not-found']
            }

            const pageElem = page.render()
            {
                pageElem.style.minHeight = '100%'
            }

            root.innerHTML = ''
            root.appendChild(pageElem)

            document.title = page.title + ' @ Kiwibit'
        }
    })
}
