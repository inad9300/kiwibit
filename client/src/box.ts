import {html} from './html'

interface BoxOptions {
    tag?: keyof HTMLElementTagNameMap
    gap?: string
    justify?: 'space-evenly' | 'space-between'
    wrap?: 'wrap' | 'reverse'
}

function box(
    direction: 'row' | 'column',
    marginProp: 'marginLeft' | 'marginTop',
    options: BoxOptions = {}
) {
    const root = html(options.tag || 'div')

    root.style.display = 'flex'
    root.style.flexDirection = direction

    if (options.justify !== undefined)
        root.style.justifyContent = options.justify

    if (options.wrap !== undefined)
        root.style.flexWrap = options.wrap

    return Object.assign(root, {
        setChildren(items: HTMLElement[]) {
            if (options.gap !== undefined)
                for (let i = 1; i < items.length; ++i)
                    items[i].style[marginProp] = options.gap

            root.innerHTML = ''
            root.append(...items)
        }
    })
}

export const hbox = box.bind(null, 'row', 'marginLeft')
export const vbox = box.bind(null, 'column', 'marginTop')
