import { getCurrentPage } from '../pages'
import { Html } from '../components/Html'
import { Icon } from '../components/Icon'
import { Link } from '../components/Link'
import { Spacer } from '../components/Spacer'
import { Logo } from './Logo'

export function Header() {
  const page = getCurrentPage()

  const pageIcon = Icon(page.icon).with(it => {
    it.style.color = page.iconColor
    it.style.margin = '16px 0 0 8px'
  })

  const pageTitle = Html('span').with(it => {
    it.textContent = page.title
    it.style.margin = '15px 12px 0 8px'
    it.style.fontSize = '17px'
  })

  const buyMeACoffeeImg = Html('img').with(it => {
    it.src = 'https://cdn.buymeacoffee.com/buttons/default-orange.png'
    it.alt = 'Buy me a coffee'
    it.width = 145
    it.height = 34
    it.style.borderRadius = '3px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.5)'
    it.style.backgroundColor = '#ff813f'
    it.style.color = '#fff'
  })

  const buyMeACoffeeLink = Link('https://www.buymeacoffee.com/wu6S9Ob0k').with(it => {
    it.target = '_blank'
    it.style.margin = '7px 7px 0 0'
    it.append(buyMeACoffeeImg)
  })

  return Html('header').with(it => {
    it.style.display = 'flex'
    it.style.flexDirection = 'row'
    it.style.borderBottom = '1px solid lightgrey'
    it.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.1)'

    it.append(Logo(), pageIcon, pageTitle, Spacer(), buyMeACoffeeLink)
  })
}
