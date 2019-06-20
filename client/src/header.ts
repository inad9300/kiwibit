import {html} from './html'
import {pages} from './pages'

export function header(activePageSlug: keyof typeof pages) {
    const titleLink = html('a')
    titleLink.textContent = 'Kiwibit'
    titleLink.href = '?page=home'
    titleLink.style.textDecoration = 'none'
    titleLink.style.fontSize = '24px'
    titleLink.style.fontWeight = 'normal'
    titleLink.style.padding = '3px 6px'
    titleLink.style.color = 'white'
    titleLink.onmouseenter = () => titleLink.style.color = 'darkseagreen'
    titleLink.onmouseleave = () => titleLink.style.color = 'white'

    const appTitle = html('h1')
    appTitle.style.margin = '7px 0 0 0'
    appTitle.style.lineHeight = '0'
    appTitle.append(titleLink)

    const mainMenu = html('ul')
    mainMenu.style.margin = '0'
    mainMenu.style.padding = '0'
    mainMenu.style.listStyle = 'none'
    mainMenu.style.flex = '1'
    mainMenu.style.textAlign = 'center'

    const pagesInMainMenu = [pages['meal-plan'], pages['charts']] // TODO Reminders (bell), Settings/Profile.
    mainMenu.append(
        ...pagesInMainMenu.map((page, idx) =>
            menuItem(page, idx === 0, page.slug === activePageSlug)
        )
    )

    const root = html('header')
    root.style.backgroundColor = '#333'
    root.style.padding = '12px 32px'
    root.style.display = 'flex'
    root.append(appTitle, mainMenu)

    return root
}

function menuItem(page: typeof pages[0], isFirst: boolean, isActive: boolean) {
    const itemLink = html('a')
    itemLink.textContent = page.title
    itemLink.href = '?page=' + page.slug
    itemLink.style.padding = '6px 12px'
    itemLink.style.color = '#eee'
    itemLink.style.textDecoration = 'none'
    itemLink.style.borderRadius = '4px'

    if (isActive) {
        itemLink.dataset.active = 'true'
        itemLink.style.backgroundColor = '#111'
    }

    itemLink.onmouseenter = () => {
        if (itemLink.dataset.active === 'true') {
            return
        }
        itemLink.style.backgroundColor = '#222'
    }

    itemLink.onmouseleave = () => {
        if (itemLink.dataset.active === 'true') {
            return
        }
        itemLink.style.backgroundColor = 'transparent'
    }

    const root = html('li')
    root.style.display = 'inline-block'
    root.appendChild(itemLink)

    if (!isFirst) {
        root.style.marginLeft = '4px'
    }

    return root
}
