import { pages } from '../pages'
import { List } from '../components/List'
import { MenuItem, menuItemWidth } from './MenuItem'

const findablePages = [
  pages['home'],
  pages['top-foods'],
  pages['food-finder']
]

export function AppsMenu(trigger: HTMLElement) {
  const root = List().with(it => {
    it.hidden = true
    it.setChildren(findablePages.map(p => MenuItem(p)))
    it.style.opacity = '0'
    it.style.padding = '12px'
    it.style.width = (menuItemWidth * 3 + 26) + 'px'
    it.style.border = '1px solid lightgrey'
    it.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'
    it.style.fontSize = '13px'
    it.style.fontFamily = 'system-ui, sans-serif'
    it.style.lineHeight = 'initial'
    it.style.backgroundColor = 'white'
    it.style.position = 'absolute'
    it.style.zIndex = '10'
    it.style.left = '5px'
    it.style.top = '0'

    return {
      toggle() {
        if (!root.hidden) {
          close()
        } else {
          open()
        }
      },
      onOpen: () => {},
      onClose: () => {}
    }
  })

  document.body.addEventListener('click', evt => {
    if (!root.hidden && !root.contains(evt.target as Node) && !trigger.contains(evt.target as Node)) {
      close()
    }
  })

  document.body.addEventListener('keyup', evt => {
    if (evt.key === 'Esc' || evt.key === 'Escape') {
      close()
    }
  })

  const frames = 8
  const opacityMax = 1
  const opacityMin = 0
  const yPosMax = 53
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
      root.hidden = true
    }
  }

  function open() {
    root.hidden = false
    opacity = opacityMin
    yPos = yPosMin
    requestAnimationFrame(smoothOpening)
    root.onOpen()
  }

  function close() {
    opacity = opacityMax
    yPos = yPosMax
    requestAnimationFrame(smoothClosing)
    root.onClose()
  }

  return root
}
