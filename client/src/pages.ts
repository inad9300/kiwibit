import { HomePage } from './home/HomePage'
import { TopFoodsPage } from './top-foods/TopFoodsPage'
import { FoodFinderPage } from './food-finder/FoodFinderPage'
import { MealPlanPage } from './meal-plan/MealPlanPage'
import { SettingsPage } from './settings/SettingsPage'
import { NotFoundPage } from './not-found/NotFoundPage'
import type { IconName } from './components/Icon'
import { getUrlParams } from './utils/getUrlParams'
import { IntakeReferencesPage } from './intake-references/IntakeReferencesPage'

export enum Page {
  Home = 'home',
  TopFoods = 'top-foods',
  FoodFinder = 'food-finder',
  IntakeReferences = 'intake-references',
  MealPlan = 'meal-plan',
  Settings = 'settings',
  NotFound = 'not-found'
}

export function getCurrentPage(): PageMap[Page.NotFound] {
  const pageSlug = getUrlParams().get('page')
  if (!pageSlug) {
    history.replaceState(null, '', '/?page=' + Page.Home)
    return pages['home']
  }

  return pages.hasOwnProperty(pageSlug)
    ? pages[pageSlug as keyof typeof pages]
    : pages['not-found']
}

type PageMap = {
  [id in Page]: {
    slug: Page
    title: string
    title_short?: string
    icon: IconName
    iconColor: string
    component: () => HTMLElement
  }
}

export const pages: PageMap = {
  [Page.Home]: {
    slug: Page.Home,
    title: 'Home',
    icon: 'home',
    iconColor: 'rgb(148, 151, 189)',
    component: HomePage
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
  [Page.IntakeReferences]: {
    slug: Page.IntakeReferences,
    title: 'Intake References',
    title_short: 'Intake Refs.',
    icon: 'ruler-combined',
    iconColor: 'rgb(210, 218, 103)',
    component: IntakeReferencesPage
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
