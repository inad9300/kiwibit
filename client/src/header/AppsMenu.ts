import { pages } from '../pages'
import { List } from '../components/List'
import { Icon } from '../components/Icon'
import { Link } from '../components/Link'

const findablePages = [pages['top-foods'], pages['food-finder']]

const itemWidth = 100

export function AppsMenu(trigger: HTMLElement) {
  const root = List()
  root.style.display = 'none'
  root.style.opacity = '0'
  root.style.padding = '12px'
  root.style.width = (itemWidth * 2 + 26) + 'px'
  root.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  root.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'
  root.style.fontSize = '13px'
  root.style.fontWeight = 'normal'
  root.style.backgroundColor = 'white'
  root.style.position = 'absolute'
  root.style.zIndex = '10'
  root.style.left = '5px'
  root.style.top = '0'
  root.append(...findablePages.map(p => MenuItem(p)))

  document.body.addEventListener('click', evt => {
    if (isOpen() && !root.contains(evt.target as Node) && !trigger.contains(evt.target as Node)) {
      close()
    }
  })

  document.body.addEventListener('keyup', evt => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      close()
    }
  })

  let onOpenCb = () => {}
  let onCloseCb = () => {}

  const frames = 8
  const opacityMax = 1
  const opacityMin = 0
  const yPosMax = 54
  const yPosMin = 36
  const opacityInc = (opacityMax - opacityMin) / frames
  const yPosInc = (yPosMax - yPosMin) / frames

  let opacity = 0
  let yPos = 0

  function smoothOpening() {
    opacity = Math.min(opacity + opacityInc, opacityMax)
    yPos = Math.min(yPos + yPosInc, yPosMax)

    root.style.opacity = opacity + ''
    root.style.top = yPos + 'px'

    if (opacity < opacityMax) {
      requestAnimationFrame(smoothOpening)
    }
  }

  function smoothClosing() {
    opacity = Math.max(opacity - opacityInc, opacityMin)
    yPos = Math.max(yPos - yPosInc, yPosMin)

    root.style.opacity = opacity + ''
    root.style.top = yPos + 'px'

    if (opacity > opacityMin) {
      requestAnimationFrame(smoothClosing)
    } else {
      root.style.display = 'none'
    }
  }

  function open() {
    root.style.display = 'block'
    opacity = opacityMin
    yPos = yPosMin
    requestAnimationFrame(smoothOpening)
    onOpenCb()
  }

  function close() {
    opacity = opacityMax
    yPos = yPosMax
    requestAnimationFrame(smoothClosing)
    onCloseCb()
  }

  function isOpen() {
    return root.style.display !== 'none'
  }

  return Object.assign(root, {
    toggle() {
      if (isOpen()) {
        close()
      } else {
        open()
      }
    },
    onOpen: (cb: () => void) => onOpenCb = cb,
    onClose: (cb: () => void) => onCloseCb = cb,
    isOpen
  })
}

function MenuItem(page: typeof pages['top-foods']) {
  const link = Link('/?page=' + page.slug)
  link.style.textDecoration = 'none'
  link.style.display = 'flex'
  link.style.flexDirection = 'column'
  link.style.width = itemWidth + 'px'
  link.style.padding = '10px'
  link.style.border = '1px solid transparent'
  link.style.textAlign = 'center'
  link.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.8)'
  link.style.color = '#000'
  link.onmouseover = link.onfocus = () => {
    link.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
    link.style.borderColor = 'rgba(0, 0, 0, 0.08)'
  }
  link.onmouseout = link.onblur = () => {
    link.style.backgroundColor = 'transparent'
    link.style.borderColor = 'transparent'
  }

  const name = document.createElement('span')
  name.textContent = page.title

  const icon = Icon(page.icon)
  icon.style.color = page.iconColor
  icon.style.fontSize = '22px'
  icon.style.marginBottom = '4px'

  link.append(icon, name)

  const root = document.createElement('li')
  root.append(link)
  root.style.float = 'left'

  return root
}
