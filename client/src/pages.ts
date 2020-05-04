import { WelcomePage } from './welcome/WelcomePage'
import { TopFoodsPage } from './top-foods/TopFoodsPage'
import { FoodFinderPage } from './food-finder/FoodFinderPage'
import { MealPlanPage } from './meal-plan/MealPlanPage'
import { SettingsPage } from './settings/SettingsPage'
import { NotFoundPage } from './not-found/NotFoundPage'
import type { IconName } from './components/Icon'
import { getUrlParams } from './utils/getUrlParams'

export enum Page {
  Welcome = 'welcome',
  TopFoods = 'top-foods',
  FoodFinder = 'food-finder',
  MealPlan = 'meal-plan',
  Settings = 'settings',
  NotFound = 'not-found'
}

export function getCurrentPage(): PageMap[Page.NotFound] {
  const pageSlug = getUrlParams().get('page')

  return pages.hasOwnProperty(pageSlug!)
    ? pages[pageSlug as keyof typeof pages]
    : pages['welcome']
}

type PageMap = {
  [id in Page]: {
    slug: Page
    title: string
    icon: IconName
    iconColor: string
    component: () => HTMLElement
  }
}

export const pages: PageMap = {
  [Page.Welcome]: {
    slug: Page.Welcome,
    title: 'Welcome',
    icon: 'hand-spock',
    iconColor: 'rgb(148, 151, 189)',
    component: WelcomePage
  },
  [Page.TopFoods]: {
    slug: Page.TopFoods,
    title: 'Top Foods',
    icon: 'seedling',
    iconColor: 'rgb(151, 189, 148)',
    component: TopFoodsPage
  },
  [Page.FoodFinder]: {
    slug: Page.FoodFinder,
    title: 'Food Finder',
    icon: 'binoculars',
    iconColor: 'rgb(189, 167, 148)',
    component: FoodFinderPage
  },
  [Page.MealPlan]: {
    slug: Page.MealPlan,
    title: 'Meal Plan',
    icon: 'calendar-week',
    iconColor: '#777',
    component: MealPlanPage
  },
  [Page.Settings]: {
    slug: Page.Settings,
    title: 'Settings',
    icon: 'user-cog',
    iconColor: '#666',
    component: SettingsPage
  },
  [Page.NotFound]: {
    slug: Page.NotFound,
    title: 'Not Found',
    icon: 'question',
    iconColor: '#888',
    component: NotFoundPage
  }
}
