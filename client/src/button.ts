import {html} from './html'

export function button() {
    const root = html('button')
    root.style.cursor = 'pointer'
    root.style.border = 'none'
    return root
}
