import {homePage} from './homePage'
import {mealPlanPage} from './mealPlanPage'
import {chartsPage} from './chartsPage'
import {settingsPage} from './settingsPage'
import {notFoundPage} from './notFoundPage'

const pages = {
    'home': {
        render: homePage,
        title: 'Home'
    },
    'meal-plan': {
        render: mealPlanPage,
        title: 'Meal Plan'
    },
    'charts': {
        render: chartsPage,
        title: 'Charts'
    },
    'settings': {
        render: settingsPage,
        title: 'Settings'
    },
    'not-found': {
        render: notFoundPage,
        title: 'Not Found'
    }
}

export function app() {
    const root = document.createElement('div')
    {
        root.style.height = '100%'
    }

    return Object.assign(root, {
        goTo(pageUrl: string | null) {
            let page = pages[pageUrl as keyof typeof pages]

            if (!pageUrl)
                page = pages['home']
            else if (!page)
                page = pages['not-found']

            const pageElem = page.render()
            {
                pageElem.style.height = '100%'
            }

            root.innerHTML = ''
            root.appendChild(pageElem)

            document.title = page.title + ' @ Kiwibit'
        }
    })
}
