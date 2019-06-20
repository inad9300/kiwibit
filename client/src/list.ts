import {html} from './html'

export function list() {
    const root = html('ul')
    root.style.listStyle = 'none'
    root.style.margin = '0'
    root.style.padding = '0'

    return root
}
