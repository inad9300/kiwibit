let i = 0

export function customEvent<T>() {
    const name = 'customEvent' + (++i)
    const elems: HTMLElement[] = []

    return {
        listen: (elem: HTMLElement, listener: (evt: CustomEvent<T>) => void) => {
            elems.push(elem)
            elem.addEventListener(name, listener)
        },
        send: (detail: T) => {
            elems.forEach(elem => elem.dispatchEvent(new CustomEvent<T>(name, {detail}))
        }
    }
}
