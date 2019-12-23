interface BoxOptions {
  tag?: keyof HTMLElementTagNameMap
  gap?: string
  justify?: 'space-evenly' | 'space-between'
  wrap?: 'wrap' | 'reverse'
}

function box(
  direction: 'row' | 'column',
  marginProp: 'marginLeft' | 'marginTop',
  children: HTMLElement[],
  options: BoxOptions = {}
) {
  const root = document.createElement(options.tag || 'div')
  root.style.display = 'flex'
  root.style.flexDirection = direction
  root.append(...children)

  if (options.justify !== undefined) {
    root.style.justifyContent = options.justify
  }

  if (options.wrap !== undefined) {
    root.style.flexWrap = options.wrap
  }

  if (options.gap !== undefined) {
    for (let i = 1; i < children.length; ++i) {
      children[i].style[marginProp] = options.gap
    }
  }

  return root
}

export const hbox = box.bind(null, 'row', 'marginLeft')
export const vbox = box.bind(null, 'column', 'marginTop')
