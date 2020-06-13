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

  const buyMeACoffeeLink = Link('https://buymeacoffee.com/wu6S9Ob0k').with(it => {
    it.target = '_blank'
    it.style.margin = '7px 7px 0 0'
    it.style.padding = '1px 8px'
    it.textContent = 'Buy me a coffee!'
    it.style.borderRadius = '3px'
    it.style.height = '34px'
    it.style.fontSize = '15px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.3)'
    it.style.backgroundColor = '#ff8749'
    it.style.color = '#fff'
    it.style.fontFamily = 'Pacifico, sans-serif'
    it.style.textShadow = '0 1px 0 rgba(0, 0, 0, 0.15)'

    it.append(
      Icon('mug-hot').with(it => {
        it.style.color = 'rgba(0, 0, 0, 0.35)'
        it.style.marginLeft = '7px'
        it.style.filter = 'drop-shadow(0 1px 0 rgba(255, 255, 255, 0.6))'
      })
    )
  })

  return Html('header').with(it => {
    it.style.display = 'flex'
    it.style.flexDirection = 'row'
    it.style.borderBottom = '1px solid lightgrey'
    it.style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.1)'

    it.append(Logo(), pageIcon, pageTitle, Spacer(), buyMeACoffeeLink)
  })
}
