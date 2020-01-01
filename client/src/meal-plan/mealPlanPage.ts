import { list } from '../shared/list'
import { weeklyPlanBoard } from './weeklyPlanBoard'
import { nutritionalOverview } from './nutritionalOverview'
import { dailyDozen } from './dailyDozen'
import { shoppingList } from './shoppingList'

export function mealPlanPage() {
  const root = document.createElement('div')
  root.append(weeklyPlanBoard(), tabbedSection())

  return root
}

function tabbedSection() {
  const tabInfo = [
    // TODO Counters.
    { name: 'Nutritional Overview', side: 'left' as 'left', content: nutritionalOverview },
    { name: 'Daily Dozen', side: 'left' as 'left', content: dailyDozen },
    { name: 'Shopping List', side: 'right' as 'right', content: shoppingList }
  ]

  let tabContent: HTMLElement = document.createElement('div')

  const tabs: HTMLLIElement[] = []
  tabInfo.forEach(ti =>
    tabs.push(
      tab(ti.name, ti.side, tabs, () => {
        const nextTabContent = ti.content()
        nextTabContent.style.padding = '16px'
        root.replaceChild(nextTabContent, tabContent)
        tabContent = nextTabContent
      })
    )
  )

  const tabList = list()
  tabList.style.padding = '0 12px'
  tabList.style.borderBottom = '1px solid #666'
  tabList.append(...tabs)

  const root = document.createElement('div')
  root.style.padding = '32px'
  root.append(tabList, tabContent)

  tabs[0].click()

  return root
}

function tab(name: string, side: 'left' | 'right', tabs: HTMLLIElement[], onClick: () => void) {
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
function tabs(tabs: HTMLLIElement[], contents: HTMLElement[]) {
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
