import {h} from '@soil/dom'
import {IconName} from '@fortawesome/fontawesome-common-types'

export function clear() {
    return h.div({style: {clear: 'both'}})
}

export function title(t: string) {
    document.title = t + ' @ Kiwibit'
}

export function icon(name: IconName) {
    return h.i({className: 'fas fa-' + name})
}
