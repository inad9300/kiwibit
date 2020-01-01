import { topFoodsPage } from './top-foods/topFoodsPage'
import { foodFinderPage } from './food-finder/foodFinderPage'
import { mealPlanPage } from './meal-plan/mealPlanPage'
import { settingsPage } from './settings/settingsPage'
import { notFoundPage } from './not-found/notFoundPage'

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
    element: topFoodsPage
  },
  [Page.FoodFinder]: {
    slug: Page.FoodFinder,
    title: 'Food Finder',
    element: foodFinderPage
  },
  [Page.MealPlan]: {
    slug: Page.MealPlan,
    title: 'Meal Plan',
    element: mealPlanPage
  },
  [Page.Settings]: {
    slug: Page.Settings,
    title: 'Settings',
    element: settingsPage
  },
  [Page.NotFound]: {
    slug: Page.NotFound,
    title: 'Not Found',
    element: notFoundPage
  }
}
