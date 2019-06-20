import {html} from './html'
import {header} from './header'

export function chartsPage() {
    const root = html('div')
    root.append(header('charts'))

    return root
}
