import {header} from './header'
import {footer} from './footer'
import {icon} from './icon'
import {checkbox} from './checkbox'
import {html} from './html'
import {IconName} from '@fortawesome/fontawesome-common-types'
import {randomInt} from './randomInt'
import {appInstance} from './main' // FIXME?

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
        btn.style.border = 'none'
        btn.style.backgroundColor = 'white'
        btn.style.cursor = 'pointer'
        btn.style.fontSize = '16px'
        btn.style.color = '#333'

        btn.append(icon(iconName))
    }

    return btn
}

function planCard() {
    const title = html('h1')
    const body = html('div')

    const root = html('article')
    {
        root.style.display = 'inline-flex'
        root.style.flexDirection = 'column'
        root.style.height = '500px'
        root.style.width = '360px'

        {
            title.style.textAlign = 'center'
            title.style.margin = '0 0 4px 0'
            title.style.color = '#333'
        }

        {
            body.style.flex = '1'
            body.style.backgroundColor = 'white'
            body.style.borderRadius = '3px'
            body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
            body.style.position = 'relative'

            body.onmouseenter = () => addBtn.style.display = 'block'
            body.onmouseleave = () => addBtn.style.display = 'none'

            const addBtn = html('button')
            {
                const size = '50px'
                addBtn.style.display = 'none'
                addBtn.style.width = size
                addBtn.style.height = size
                addBtn.style.borderRadius = '50%'
                addBtn.style.border = 'none'
                addBtn.style.backgroundColor = 'darkred'
                addBtn.style.cursor = 'pointer'
                addBtn.style.fontSize = '24px'
                addBtn.style.color = '#eee'
                addBtn.style.padding = '0'
                addBtn.style.position = 'absolute'
                addBtn.style.bottom = '16px'
                addBtn.style.right = '16px'

                addBtn.onmouseenter = () => popover.style.display = 'block'
                addBtn.onmouseleave = () => popover.style.display = 'none'

                const popover = html('div')
                {
                    popover.style.display = 'none'
                    popover.style.backgroundColor = 'white'
                    popover.style.borderRadius = '3px'
                    popover.style.color = '#333'
                    popover.style.padding = '4px'
                    popover.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
                    popover.style.zIndex = '1'
                    popover.style.position = 'absolute'
                    popover.style.top = '-45px'
                    popover.style.left = '-16px'

                    const addFoodIcon = icon('carrot')
                    {
                        addFoodIcon.title = 'Add food'

                        addFoodIcon.onclick = () => appInstance.prepend(addFoodModal())
                    }

                    const addRecipeIcon = icon('utensils')
                    {
                        addRecipeIcon.title = 'Add recipe'
                    }

                    // const addSmoothieIcon = icon('blender')
                    // const addSaladIcon = icon('seedling')

                    const icons = [addFoodIcon, addRecipeIcon]

                    for (const i of icons) {
                        i.style.padding = '8px'
                        i.style.borderRadius = '3px'

                        i.onmouseenter = () => i.style.backgroundColor = '#ddd'
                        i.onmouseleave = () => i.style.backgroundColor = 'transparent'
                    }

                    popover.append(...icons)
                }

                addBtn.append(icon('plus'), popover)
            }

            body.append(addBtn)
        }

        root.append(title, body)
    }

    return Object.assign(root, {
        setTitle(t: string) {
            title.textContent = t
        },
        activate() {
            body.style.border = '2px solid darkred'
        },
        deactivate() {
            body.style.border = 'none'
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
            // TODO Counters.
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

function addFoodModal() {
    const backdrop = html('div')
    {
        backdrop.style.width = '100%'
        backdrop.style.height = '100%'
        backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
        backdrop.style.position = 'fixed'
        backdrop.style.zIndex = '1'
        backdrop.style.top = '0'
        backdrop.style.left = '0'
    }

    const root = html('article')
    {
        root.style.display = 'flex'
        root.style.flexDirection = 'row'
        root.style.width = '1024px'
        root.style.maxWidth = '90%'
        root.style.position = 'absolute'
        root.style.left = '0'
        root.style.right = '0'
        root.style.margin = '32px auto'
        root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'

        const sidebar = html('aside')
        {
            sidebar.style.padding = '8px 12px'
            sidebar.style.backgroundColor = '#ccc'
            sidebar.style.borderRadius = '3px 0 0 3px'

            const mostUsedListTitle = html('h1')
            {
                mostUsedListTitle.textContent = 'Most used'
                mostUsedListTitle.style.margin = '0'
                mostUsedListTitle.style.fontWeight = 'normal'
                mostUsedListTitle.style.borderBottom = '1px solid black'
            }

            const mostUsedList = html('ul')

            const yourCookbookListTitle = html('h1')
            {
                yourCookbookListTitle.textContent = 'Your cookbook'
                yourCookbookListTitle.style.margin = '0'
                yourCookbookListTitle.style.fontWeight = 'normal'
                yourCookbookListTitle.style.borderBottom = '1px solid black'
            }

            const yourCookbookList = html('ul')

            sidebar.append(mostUsedListTitle, mostUsedList, yourCookbookListTitle, yourCookbookList)
        }

        const rightPart = html('div')
        {
            rightPart.style.flex = '1'
            rightPart.style.display = 'flex'
            rightPart.style.flexDirection = 'column'

            const nav = html('nav')
            {
                nav.style.backgroundColor = '#eee'
                nav.style.padding = '8px 12px'
                nav.style.borderTopRightRadius = '3px'

                const findBtn = html('button')
                {
                    findBtn.textContent = 'Find'
                }

                const importBtn = html('button')
                {
                    importBtn.textContent = 'Import'
                }

                const newBtn = html('button')
                {
                    newBtn.textContent = 'New'
                }

                const btns = [findBtn, importBtn, newBtn]
                for (let i = 0; i < btns.length; ++i) {
                    btns[i].style.cursor = 'pointer'

                    if (i !== 0) {
                        btns[i].style.marginLeft = '8px'
                    }
                }

                nav.append(...btns)
            }

            const main = html('main')
            {
                main.style.flex = '1'
                main.style.backgroundColor = 'white'
                main.style.padding = '8px 12px'
                main.textContent = 'Main'
            }

            const footer = html('footer')
            {
                footer.style.backgroundColor = '#eee'
                footer.style.padding = '8px 12px'
                footer.style.borderBottomRightRadius = '3px'

                const addBtn = html('button')
                {
                    addBtn.textContent = 'Add'
                    addBtn.style.cursor = 'pointer'
                    addBtn.style.cssFloat = 'right'
                }

                const cancelBtn = html('button')
                {
                    cancelBtn.textContent = 'Cancel'
                    cancelBtn.style.cursor = 'pointer'
                    cancelBtn.style.marginLeft = '8px'
                    cancelBtn.style.cssFloat = 'right'
                    cancelBtn.onclick = () => backdrop.remove()
                }

                footer.append(cancelBtn, addBtn)
            }

            rightPart.append(nav, main, footer)
        }

        root.append(sidebar, rightPart)
    }

    backdrop.append(root)

    return backdrop
}
