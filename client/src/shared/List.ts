export function List(children?: (string | HTMLElement)[]) {
  const root = document.createElement('ul')
  root.style.listStyle = 'none'
  root.style.margin = '0'
  root.style.padding = '0'

  if (children) {
    root.append(...children.map(c => {
      const li = document.createElement('li')
      li.append(c)
      return li
    }))
  }

  return root
}
