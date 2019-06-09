import {homePage} from './homePage'
import {mealPlanPage} from './mealPlanPage'
import {chartsPage} from './chartsPage'
import {settingsPage} from './settingsPage'
import {notFoundPage} from './notFoundPage'

export const pages = {
    'home': {
        slug: 'home',
        render: homePage,
        title: 'Home'
    },
    'meal-plan': {
        slug: 'meal-plan',
        render: mealPlanPage,
        title: 'Meal Plan'
    },
    'charts': {
        slug: 'charts',
        render: chartsPage,
        title: 'Charts'
    },
    'settings': {
        slug: 'settings',
        render: settingsPage,
        title: 'Settings'
    },
    'not-found': {
        slug: 'not-found',
        render: notFoundPage,
        title: 'Not Found'
    }
}
