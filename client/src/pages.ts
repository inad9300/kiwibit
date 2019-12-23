import { homePage } from './home/homePage'
import { mealPlanPage } from './meal-plan/mealPlanPage'
import { chartsPage } from './charts/chartsPage'
import { settingsPage } from './settings/settingsPage'
import { notFoundPage } from './not-found/notFoundPage'

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
