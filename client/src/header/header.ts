import { pageFinderInput } from './pageFinderInput'

/**
 * TODO Reminders (bell), Settings/Profile.
 */
export function header() {
  const logo = document.createElement('h1')
  logo.textContent = 'K'
  logo.title = 'Kiwibit'
  logo.style.margin = '0'

  const notificationsIcon = document.createElement('span')

  const root = document.createElement('header')
  root.style.display = 'flex'
  root.style.flexDirection = 'row'
  root.style.justifyContent = 'space-between'
  root.style.padding = '10px 20px'
  root.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.7)'
  root.append(logo, pageFinderInput(), notificationsIcon)

  return root
}
