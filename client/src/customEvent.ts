let i = 0

export function customEvent<T>() {
    const name = 'customEvent' + (++i)
    const elems: HTMLElement[] = []

    return {
        addListener: (elem: HTMLElement, listener: (evt: CustomEvent<T>) => void) => {
            elems.push(elem)
            elem.addEventListener(name, listener)
        },
        dispatch: (detail: T) => {
            elems.forEach(elem => elem.dispatchEvent(new CustomEvent<T>(name, {detail}))
        }
    }
}

type Listener<T> = (msg: T) => void

function _customEvent<T>() {
    const listeners: Listener<T>[] = []

    return {
        addListener: (l: Listener<T>) => listeners.push(l),
        dispatch: (msg: T) => listeners.forEach(l => l(msg))
    }
}
