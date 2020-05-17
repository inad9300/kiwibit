import { Html } from './Html'

export function List() {
  return Html('ul').with(it => {
    it.style.listStyle = 'none'
    it.style.margin = '0'
    it.style.padding = '0'

    return {
      setChildren(children: (string | HTMLElement)[]) {
        it.innerHTML = ''
        it.append(
          ...children.map(c => Html('li').with(it => it.append(c)))
        )
      }
    }
  })
}
