import { AppsMenu } from './AppsMenu'
import { getCurrentPage } from '../pages'
import { Button } from '../components/Button'
import { Icon } from '../components/Icon'
import { Link } from '../components/Link'

const triangle = document.createElement('div')
triangle.style.borderTop = '47px solid transparent'
triangle.style.borderRight = '20px solid transparent'

export function Header() {
  const page = getCurrentPage()
  const pageTitle = document.createElement('span')
  pageTitle.textContent = page.title
  pageTitle.style.margin = '15px 12px 0 8px'
  pageTitle.style.fontSize = '17px'

  const pageIcon = Icon(page.icon)
  pageIcon.style.color = page.iconColor
  pageIcon.style.margin = '16px 0 0 8px'

  const root = document.createElement('header')
  root.style.display = 'flex'
  root.style.flexDirection = 'row'
  root.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)'
  root.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.1)'

  const buyMeACoffeeImg = document.createElement('img')
  buyMeACoffeeImg.src = 'https://cdn.buymeacoffee.com/buttons/default-orange.png'
  buyMeACoffeeImg.alt = 'Buy me a coffee'
  buyMeACoffeeImg.width = 145
  buyMeACoffeeImg.height = 34
  buyMeACoffeeImg.style.borderRadius = '3px'
  buyMeACoffeeImg.style.border = '1px solid rgba(0, 0, 0, 0.5)'
  buyMeACoffeeImg.style.backgroundColor = '#ff813f'
  buyMeACoffeeImg.style.color = '#fff'

  const buyMeACoffeeLink = Link('https://www.buymeacoffee.com/wu6S9Ob0k')
  buyMeACoffeeLink.target = '_blank'
  buyMeACoffeeLink.style.margin = '7px 7px 0 0'
  buyMeACoffeeLink.append(buyMeACoffeeImg)

  const spacer = document.createElement('div')
  spacer.style.flex = '1'

  root.append(Logo(), triangle, pageIcon, pageTitle, spacer, buyMeACoffeeLink)

  return root
}

function Logo() {
  const root = Button()
  root.textContent = 'meals'
  root.style.position = 'relative'
  root.style.margin = '0'
  root.style.padding = '10px 16px 10px 16px'
  root.style.fontSize = '20px'
  root.style.fontWeight = '600'
  root.style.color = '#666'
  root.style.textShadow = '0 -1px 0 rgba(255, 255, 255, 1)'

  root.onclick = () => menu.toggle()
  root.onmouseenter = root.onfocus = () => setActive()
  root.onblur = () => setInactive()
  root.onmouseout = () => {
    if (!menu.isOpen()) {
      setInactive()
    }
  }

  setInactive()

  function setActive() {
    root.style.color = '#111'
    root.style.backgroundColor = triangle.style.borderTopColor = 'rgba(0, 0, 0, 0.09)'
  }
  function setInactive() {
    root.style.color = '#666'
    root.style.backgroundColor = triangle.style.borderTopColor = 'rgba(0, 0, 0, 0.04)'
  }

  const menu = AppsMenu(root)
  menu.onClose(setInactive)

  root.append(menu)

  return root
}
