import { AppsMenu } from './AppsMenu'
import { Html } from '../components/Html'
import { BaseButton } from '../components/BaseButton'
import { Hbox } from '../components/Box'

const height = '47px'

export function Logo() {
  const logoSquare = BaseButton().with(it => {
    it.textContent = 'meals'
    it.style.height = height
    it.style.margin = '0'
    it.style.padding = '10px 16px 10px 14px'
    it.style.fontFamily = 'Pacifico, sans-serif'
    it.style.fontSize = '28px'
    it.style.lineHeight = '0'
    it.style.textShadow = '0 -1px 0 rgba(255, 255, 255, 0.75)'
    it.style.backgroundColor = '#eee'

    it.onclick = () => menu.toggle()
    it.onmouseenter = it.onfocus = setActive
    it.onblur = setInactive
    it.onmouseout = () => {
      if (menu.hidden) {
        setInactive()
      }
    }
  })

  const logoTriangle = Html('div').with(it => {
    it.style.borderTop = height + ' solid #eee'
    it.style.borderRight = '20px solid transparent'
  })

  setInactive()

  function setActive() {
    logoSquare.style.color = '#333'
  }

  function setInactive() {
    logoSquare.style.color = '#b12a42'
  }

  const menu = AppsMenu(logoSquare).with(it => {
    it.onClose = setInactive
  })

  return Hbox().with(it => {
    it.style.position = 'relative'
    it.append(logoSquare, logoTriangle, menu)
  })
}
