import { TopFoodsPage } from './top-foods/TopFoodsPage'
import { FoodFinderPage } from './food-finder/FoodFinderPage'
import { MealPlanPage } from './meal-plan/MealPlanPage'
import { SettingsPage } from './settings/SettingsPage'
import { NotFoundPage } from './not-found/NotFoundPage'

export enum Page {
  TopFoods = 'top-foods',
  FoodFinder = 'food-finder',
  MealPlan = 'meal-plan',
  Settings = 'settings',
  NotFound = 'not-found'
}

export const pages = {
  [Page.TopFoods]: {
    slug: Page.TopFoods,
    title: 'Top Foods',
    element: TopFoodsPage
  },
  [Page.FoodFinder]: {
    slug: Page.FoodFinder,
    title: 'Food Finder',
    element: FoodFinderPage
  },
  [Page.MealPlan]: {
    slug: Page.MealPlan,
    title: 'Meal Plan',
    element: MealPlanPage
  },
  [Page.Settings]: {
    slug: Page.Settings,
    title: 'Settings',
    element: SettingsPage
  },
  [Page.NotFound]: {
    slug: Page.NotFound,
    title: 'Not Found',
    element: NotFoundPage
  }
}
