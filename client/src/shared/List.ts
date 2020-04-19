import { wrap } from './wrap'

export function List(children?: (string | HTMLElement)[]) {
  const root = document.createElement('ul')
  root.style.listStyle = 'none'
  root.style.margin = '0'
  root.style.padding = '0'

  if (children) {
    root.append(...children.map(c => wrap(c, 'li')))
  }

  return root
}
