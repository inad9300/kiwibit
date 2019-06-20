import {html} from './html'

export function footer() {
    const root = html('footer')
    root.style.minHeight = '200px'
    root.style.backgroundColor = '#333'

    return root
}
