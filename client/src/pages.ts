import { homePage } from './homePage'
import { mealPlanPage } from './mealPlanPage'
import { chartsPage } from './chartsPage'
import { settingsPage } from './settingsPage'
import { notFoundPage } from './notFoundPage'

export const pages = {
  home: {
    slug: 'home',
    title: 'Home',
    render: homePage
  },
  'meal-plan': {
    slug: 'meal-plan',
    title: 'Meal Plan',
    render: mealPlanPage
  },
  charts: {
    slug: 'charts',
    title: 'Charts',
    render: chartsPage
  },
  settings: {
    slug: 'settings',
    title: 'Settings',
    render: settingsPage
  },
  'not-found': {
    slug: 'not-found',
    title: 'Not Found',
    render: notFoundPage
  }
}
