import { AppsMenu } from './AppsMenu'
import { Html } from '../components/Html'
import { BaseButton } from '../components/BaseButton'

const height = '47px'

export const logoTriangle = Html('div').with(it => {
  it.style.borderTop = height + ' solid transparent'
  it.style.borderRight = '20px solid transparent'
})

export function Logo() {
  const root = BaseButton().with(it => {
    it.textContent = 'meals'
    it.style.height = height
    it.style.position = 'relative'
    it.style.margin = '0'
    it.style.padding = '10px 16px 10px 16px'
    it.style.fontFamily = 'Pacifico, sans-serif'
    it.style.fontSize = '24px'
    it.style.lineHeight = '0'
    it.style.textShadow = '0 -1px 0 rgba(255, 255, 255, 0.75)'

    it.onclick = () => menu.toggle()
    it.onmouseenter = it.onfocus = () => setActive()
    it.onblur = () => setInactive()
    it.onmouseout = () => {
      if (menu.hidden) {
        setInactive()
      }
    }
  })

  setInactive()

  function setActive() {
    root.style.color = '#333'
    root.style.backgroundColor = logoTriangle.style.borderTopColor = 'rgba(0, 0, 0, 0.09)'
  }

  function setInactive() {
    root.style.color = '#b12a42'
    root.style.backgroundColor = logoTriangle.style.borderTopColor = 'rgba(0, 0, 0, 0.04)'
  }

  const menu = AppsMenu(root).with(it => {
    it.onClose = setInactive
  })

  root.append(menu)

  return root
}
