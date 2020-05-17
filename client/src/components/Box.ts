import { Html } from './Html'

export function Hbox<T extends keyof HTMLElementTagNameMap>(tag: T = 'div' as T) {
  return (Html(tag) as HTMLElement).with(it => {
    it.style.display = 'flex'
    it.style.flexDirection = 'row'

    return {
      setChildren: getSetChildren(it, 'marginLeft')
    }
  })
}

export function Vbox<T extends keyof HTMLElementTagNameMap>(tag: T = 'div' as T) {
  return (Html(tag) as HTMLElement).with(it => {
    it.style.display = 'flex'
    it.style.flexDirection = 'column'

    return {
      setChildren: getSetChildren(it, 'marginTop')
    }
  })
}

function getSetChildren(parent: HTMLElement, marginProp: 'marginLeft' | 'marginTop') {
  return (children: HTMLElement[], gap?: string) => {
    if (gap) {
      for (let i = 1; i < children.length; ++i) {
        children[i].style[marginProp] = gap
      }
    }

    parent.innerHTML = ''
    parent.append(...children)
  }
}
