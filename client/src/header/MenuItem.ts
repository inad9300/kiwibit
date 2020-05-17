import { Html } from '../components/Html'
import type { pages } from '../pages'
import { Icon } from '../components/Icon'
import { Link } from '../components/Link'

export const menuItemWidth = 100

export function MenuItem(page: typeof pages['top-foods']) {
  const icon = Icon(page.icon).with(it => {
    it.style.width = 'auto'
    it.style.color = page.iconColor
    it.style.fontSize = '22px'
    it.style.marginBottom = '4px'
  })

  const name = Html('span').with(it => {
    it.textContent = page.title
  })

  const link = Link('?page=' + page.slug).with(it => {
    it.append(icon, name)
    it.style.textDecoration = 'none'
    it.style.display = 'flex'
    it.style.flexDirection = 'column'
    it.style.width = menuItemWidth + 'px'
    it.style.padding = '10px'
    it.style.border = '1px solid transparent'
    it.style.textAlign = 'center'
    it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 0.8)'
    it.style.color = '#000'
    it.onmouseover = it.onfocus = () => {
      it.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'
      it.style.borderColor = 'rgba(0, 0, 0, 0.08)'
    }
    it.onmouseout = it.onblur = () => {
      it.style.backgroundColor = 'transparent'
      it.style.borderColor = 'transparent'
    }
  })

  return Html('li').with(it => {
    it.append(link)
    it.style.float = 'left'
  })
}
