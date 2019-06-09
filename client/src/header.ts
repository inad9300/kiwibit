import {html} from './html'
import {pages} from './pages'

export function header(activePageSlug: keyof typeof pages) {
    const root = html('header')
    {
        root.style.backgroundColor = '#333'
        root.style.padding = '12px 32px'
        root.style.display = 'flex'

        const appTitle = html('h1')
        {
            appTitle.style.margin = '7px 0 0 0'
            appTitle.style.lineHeight = '0'

            const link = html('a')
            {
                link.textContent = 'Kiwibit'
                link.href = '?page=home'
                link.style.textDecoration = 'none'
                link.style.fontSize = '24px'
                link.style.fontWeight = 'normal'
                link.style.padding = '3px 6px'
                link.style.color = 'white'
                link.onmouseenter = () => link.style.color = 'darkseagreen'
                link.onmouseleave = () => link.style.color = 'white'
            }

            appTitle.append(link)
        }

        const mainMenu = html('ul')
        {
            mainMenu.style.margin = '0'
            mainMenu.style.padding = '0'
            mainMenu.style.listStyle = 'none'
            mainMenu.style.flex = '1'
            mainMenu.style.textAlign = 'center'

            const pagesInMainMenu = [pages['meal-plan'], pages['charts']]

            const menuItems = pagesInMainMenu.map((page, idx) => {
                const menuItem = html('li')
                {
                    menuItem.style.display = 'inline-block'
                    if (idx !== 0) {
                        menuItem.style.marginLeft = '4px'
                    }

                    const itemLink = html('a')
                    {
                        itemLink.textContent = page.title
                        itemLink.href = '?page=' + page.slug
                        itemLink.style.padding = '6px 12px'
                        itemLink.style.color = '#eee'
                        itemLink.style.textDecoration = 'none'
                        itemLink.style.borderRadius = '4px'

                        if (page.slug === activePageSlug) {
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
                    }

                    menuItem.appendChild(itemLink)
                }

                return menuItem
            })

            mainMenu.append(...menuItems)
        }

        root.append(appTitle, mainMenu)
    }

    return root
}
