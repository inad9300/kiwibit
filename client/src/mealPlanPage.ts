import {header} from './header'
import {footer} from './footer'
import {icon} from './icon'
import {checkbox} from './checkbox'
import {html} from './html'
import {IconName} from '@fortawesome/fontawesome-common-types'
import {randomInt} from './randomInt'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function mealPlanPage() {
    const root = html('div')
    {
        root.append(header('meal-plan'), weeklyPlan(), tabbedSection(), footer())
    }

    return root
}

function weeklyPlan() {
    const root = html('div')
    {
        root.style.backgroundColor = 'darkseagreen'

        const planControls = html('div')
        {
            planControls.style.padding = '32px 0'
            planControls.style.textAlign = 'center'

            const priorWeekBtn = planControlBtn('arrow-left')
            const showCalendarBtn = planControlBtn('calendar-week')
            const nextWeekBtn = planControlBtn('arrow-right')

            const btns = [priorWeekBtn, showCalendarBtn, nextWeekBtn]
            for (let i = 0; i < btns.length; ++i) {
                if (i !== 0) {
                    btns[i].style.marginLeft = '8px'
                }
            }

            planControls.append(...btns)
        }

        const planDeck = html('div')
        {
            planDeck.style.textAlign = 'center'
            planDeck.style.overflowX = 'auto'
            planDeck.style.whiteSpace = 'nowrap'
            planDeck.style.paddingBottom = '32px'

            for (let i = 0; i < weekDays.length; ++i) {
                const card = planCard()
                {
                    if (i === 0) {
                        card.style.margin = '0 8px 0 32px'
                    } else if (i === weekDays.length - 1) {
                        card.style.margin = '0 32px 0 8px'
                    } else {
                        card.style.margin = '0 8px'
                    }
                    card.setTitle(weekDays[i])
                    if (i === 1) {
                        card.activate()
                    }
                }

                planDeck.append(card)
            }
        }

        root.append(planControls, planDeck)
    }

    return root
}

function planControlBtn(iconName: IconName) {
    const btn = html('button')
    {
        const size = '32px'
        btn.style.width = size
        btn.style.height = size
        btn.style.borderRadius = '50%'
        btn.style.fontSize = '16px'
        btn.style.border = 'none'
        btn.style.backgroundColor = 'white'
        btn.style.cursor = 'pointer'
    }

    const i = icon(iconName)
    {
        i.style.color = '#333'
    }

    btn.append(i)

    return btn
}

function planCard() {
    const title = html('h1')
    const titleColor = '#333'

    const root = html('article')
    {
        root.style.display = 'inline-flex'
        root.style.flexDirection = 'column'
        root.style.height = '500px'
        root.style.width = '360px'

        {
            title.style.textAlign = 'center'
            title.style.margin = '0 0 4px 0'
            title.style.color = titleColor
        }

        const body = html('div')
        {
            body.style.flex = '1'
            body.style.backgroundColor = 'white'
            body.style.borderRadius = '3px'
            body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
        }

        root.append(title, body)
    }

    return Object.assign(root, {
        setTitle(t: string) {
            title.textContent = t
        },
        activate() {
            title.style.color = 'crimson'
        },
        deactivate() {
            title.style.color = titleColor
        }
    })
}

function tabbedSection() {
    const root = html('div')
    {
        root.style.padding = '32px'

        const tabList = html('ul')
        {
            tabList.style.margin = '0'
            tabList.style.padding = '0 12px'
            tabList.style.listStyle = 'none'
            tabList.style.borderBottom = '1px solid #666'
        }

        const tabInfo = [
            {name: 'Nutritional Overview', side: 'left' as 'left', content: nutritionalOverviewTab},
            {name: 'Daily Dozen', side: 'left' as 'left', content: dailyDozenTab},
            {name: 'Shopping List', side: 'right' as 'right', content: shoppingListTab}
        ]

        const tabContentPadding = '16px'

        let priorTabContent: HTMLElement

        const tabs = tabInfo.map(ti => {
            const t = tab()
            {
                t.setName(ti.name)
                t.setSide(ti.side)
                t.onclick = () => {
                    for (const t of tabs) {
                        t.deactivate()
                    }
                    t.activate()
                    const nextTabContent = ti.content()
                    nextTabContent.style.padding = tabContentPadding
                    root.replaceChild(nextTabContent, priorTabContent)
                    priorTabContent = nextTabContent
                }
            }

            return t
        })

        tabList.append(...tabs)
        root.append(tabList)

        tabs[0].activate()
        priorTabContent = tabInfo[0].content()
        priorTabContent.style.padding = tabContentPadding
        root.append(priorTabContent)
    }

    return root
}

function tab() {
    const root = html('li')
    {
        root.style.display = 'inline-block'
        root.style.color = '#333'
        root.style.cursor = 'pointer'
        root.style.padding = '12px 12px 10px 12px'
        root.style.borderBottom = '2px solid transparent'

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
    }

    return Object.assign(root, {
        setName(n: string) {
            root.textContent = n
        },
        setSide(s: 'left' | 'right') {
            if (s === 'right') {
                root.style.cssFloat = s
            }
        },
        activate() {
            root.dataset.active = 'true'
            root.style.borderBottomColor = '#666'
        },
        deactivate() {
            root.dataset.active = 'false'
            root.style.borderBottomColor = 'transparent'
        }
    })
}

function nutritionalOverviewTab() {
    const root = html('div')
    {
        for (let i = 0; i < 16; ++i) {
            const progressBar = html('progress')
            {
                progressBar.max = 100
                progressBar.value = randomInt(0, 100)
                progressBar.style.display = 'block'
                progressBar.style.marginBottom = '12px'
            }

            root.append(progressBar)
        }
    }

    return root
}

function dailyDozenTab() {
    const categories = ['Beans', 'Berries', 'Other Fruit', 'Cruciferous Vegetables', 'Greens', 'Other Vegetables', 'Flaxseeds', 'Nuts and Seeds', 'Herbs and Spices', 'Whole Grains', 'Beverages', 'Exercise']

    const root = html('ul')
    {
        root.style.listStyle = 'none'
        root.style.margin = '0'

        for (const category of categories) {
            const id = Math.random() + ''
            const item = html('li')
            {
                const check = checkbox()
                {
                    check.id = id
                }

                const label = html('label')
                {
                    label.htmlFor = id
                    label.textContent = category
                }

                item.append(check, label)
            }

            root.append(item)
        }
    }

    return root
}

function shoppingListTab() {
    const root = html('ul')
    {
        root.style.listStyle = 'none'
        root.style.margin = '0'

        const item = html('li')
        {
            const id = Math.random() + ''

            const check = checkbox()
            {
                check.id = id
            }

            const label = html('label')
            {
                label.htmlFor = id
                label.textContent = 'Pistachio Ice Cream'
            }

            item.append(check, label)
        }

        root.append(item)
    }

    return root
}
