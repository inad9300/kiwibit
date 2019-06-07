import {header} from './header'
import {footer} from './footer'
import {icon} from './icon'
import {IconName} from '@fortawesome/fontawesome-common-types'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function mealPlanPage() {
    const root = document.createElement('div')
    {}

    const weeklyPlan = document.createElement('div')
    {
        weeklyPlan.style.backgroundColor = 'darkseagreen'

        const controls = document.createElement('div')
        {
            controls.style.padding = '32px 0'
            controls.style.textAlign = 'center'

            const priorWeekBtn = planControlBtn('arrow-left')
            const showCalendarBtn = planControlBtn('calendar-week')
            const nextWeekBtn = planControlBtn('arrow-right')

            const btns = [priorWeekBtn, showCalendarBtn, nextWeekBtn]
            for (let i = 0; i < btns.length; ++i)
                if (i !== 0)
                    btns[i].style.marginLeft = '8px'

            controls.append(...btns)
        }

        const deck = document.createElement('div')
        {
            deck.style.textAlign = 'center'
            deck.style.overflowX = 'auto'
            deck.style.whiteSpace = 'nowrap'
            deck.style.padding = '0 24px 32px 24px'

            for (const day of weekDays) {
                const card = planCard()
                {
                    card.style.margin = '0 8px'
                    card.setTitle(day)
                }

                deck.appendChild(card)
            }
        }

        weeklyPlan.append(controls, deck)
    }

    const tabbedSection = document.createElement('div')
    {
        tabbedSection.style.padding = '32px'

        const tabList = document.createElement('ul')
        {
            tabList.style.margin = '0'
            tabList.style.padding = '0 12px'
            tabList.style.listStyle = 'none'
            tabList.style.borderBottom = '1px solid #666'
        }

        const tabInfo = [
            {name: 'Nutritional Overview', side: 'left'},
            {name: 'Daily Dozen', side: 'left'},
            {name: 'Shopping List', side: 'right'}
        ]
        for (const t of tabInfo) {
            const tab = document.createElement('li')
            {
                tab.textContent = t.name
                tab.style.display = 'inline-block'
                tab.style.padding = '12px'
                tab.style.color = '#333'
                // tab.style.borderBottom = '3px solid #666'

                if (t.side === 'right')
                    tab.style.cssFloat = 'right'
            }

            tabList.appendChild(tab)
        }

        const tabContent = document.createElement('div')
        {
            tabContent.style.padding = '16px'
            tabContent.textContent = `TODO`
        }

        tabbedSection.append(tabList, tabContent)
    }

    root.append(header(), weeklyPlan, tabbedSection, footer())

    return Object.assign(root, {})
}

function planControlBtn(iconName: IconName) {
    const btn = document.createElement('button')
    {
        const size = '32px'
        btn.style.width = size
        btn.style.height = size
        btn.style.borderRadius = '50%'
        btn.style.fontSize = '16px'
        btn.style.border = 'none'
        btn.style.backgroundColor = 'white'
        btn.style.cursor = 'pointer'

        const i = icon(iconName)
        {
            i.style.verticalAlign = 'text-bottom'
            i.style.color = '#333'
        }

        btn.appendChild(i)
    }

    return btn
}

function planCard() {
    const root = document.createElement('article')
    {
        root.style.display = 'inline-flex'
        root.style.flexDirection = 'column'
        root.style.height = '500px'
        root.style.width = '360px'
    }

    const title = document.createElement('h1')
    {
        title.style.textAlign = 'center'
        title.style.margin = '0 0 4px 0'
        title.style.color = '#333'
    }

    const body = document.createElement('div')
    {
        body.style.flex = '1'
        body.style.backgroundColor = 'white'
        body.style.borderRadius = '3px'
        body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    }

    root.append(title, body)

    return Object.assign(root, {
        setTitle(t: string) {
            title.textContent = t
        }
    })
}
