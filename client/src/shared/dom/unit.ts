import {h} from '@soil/dom'

export function unit(value: number | string, unit: string): h.Span {
    return h.span({
        style: {whiteSpace: 'nowrap'}
    }, [
        `${value}\u2009${unit}`
    ])
}
