import { List } from '../components/List'
import { WeeklyPlanBoard } from './WeeklyPlanBoard'
import { NutritionalOverview } from './NutritionalOverview'
import { DailyDozen } from './DailyDozen'
import { ShoppingList } from './ShoppingList'

export function MealPlanPage() {
  const root = document.createElement('div')
  root.append(WeeklyPlanBoard(), TabbedSection())

  return root
}

function TabbedSection() {
  const tabInfo = [
    { name: 'Nutritional Overview', side: 'left' as 'left', content: NutritionalOverview },
    { name: 'Daily Dozen', side: 'left' as 'left', content: DailyDozen },
    { name: 'Shopping List', side: 'right' as 'right', content: ShoppingList }
  ]

  let tabContent: HTMLElement = document.createElement('div')

  const tabs: HTMLLIElement[] = []
  tabInfo.forEach(ti =>
    tabs.push(
      Tab(ti.name, ti.side, tabs, () => {
        const nextTabContent = ti.content()
        nextTabContent.style.padding = '16px'
        root.replaceChild(nextTabContent, tabContent)
        tabContent = nextTabContent
      })
    )
  )

  const tabList = List()
  tabList.style.padding = '0 12px'
  tabList.style.borderBottom = '1px solid #666'
  tabList.append(...tabs)

  const root = document.createElement('div')
  root.style.padding = '32px'
  root.append(tabList, tabContent)

  tabs[0].click()

  return root
}

function Tab(name: string, side: 'left' | 'right', tabs: HTMLLIElement[], onClick: () => void) {
  const root = document.createElement('li')
  root.textContent = name
  root.style.display = 'inline-block'
  root.style.color = '#333'
  root.style.cursor = 'pointer'
  root.style.padding = '12px 12px 10px 12px'
  root.style.borderBottom = '2px solid transparent'

  if (side === 'right') {
    root.style.cssFloat = side
  }

  root.onclick = () => {
    tabs.forEach(t => {
      t.dataset.active = 'false'
      t.style.borderBottomColor = 'transparent'
    })

    root.dataset.active = 'true'
    root.style.borderBottomColor = '#666'

    onClick()
  }

  root.onmouseenter = () => {
    if (root.dataset.active === 'true') {
      return
    }
    root.style.borderBottomColor = '#999'
  }

  root.onmouseleave = () => {
    if (root.dataset.active === 'true') {
      return
    }
    root.style.borderBottomColor = 'transparent'
  }

  return root
}

/*
function Tabs(tabs: HTMLLIElement[], contents: HTMLElement[]) {
    const root = document.createElement('div')
    root.onclick = evt => {
        if (tabs.indexOf(evt.target as HTMLLIElement) > -1) {

        }
    }

    const tabsContainer = document.createElement('div')
    tabsContainer.append(...tabs)

    root.append(tabsContainer)

    return root
}
*/
