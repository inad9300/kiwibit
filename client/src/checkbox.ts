import {html} from './html'

export function checkbox() {
    const root = html('input')
    root.type = 'checkbox'

    return root
}
