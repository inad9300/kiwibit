import {header} from './header'
import {footer} from './footer'
import {icon} from './icon'
import {checkbox} from './checkbox'
import {html} from './html'
import {IconName} from '@fortawesome/fontawesome-common-types'
import {randomInt} from './randomInt'
import {appInstance} from './main' // FIXME?
import {hbox, vbox} from './box'
import {button} from './button'
import {list} from './list'
import {weekDays, currentWeekDay} from './cal'

export function mealPlanPage() {
    const root = html('div')
    root.append(header('meal-plan'), weeklyPlan(), tabbedSection(), footer())

    return root
}

function weeklyPlan() {
    const planControls = html('div')
    planControls.style.padding = '32px 0'
    planControls.style.textAlign = 'center'

    const priorWeekBtn = planControlBtn('arrow-left', true)
    const showCalendarBtn = planControlBtn('calendar-week', false)
    const nextWeekBtn = planControlBtn('arrow-right', false)
    planControls.append(priorWeekBtn, showCalendarBtn, nextWeekBtn)

    const planDeck = html('div')
    planDeck.style.textAlign = 'center'
    planDeck.style.overflowX = 'auto'
    planDeck.style.whiteSpace = 'nowrap'
    planDeck.style.paddingBottom = '32px'

    planDeck.append(
        ...weekDays.map((weekDay, idx) =>
            planCard(weekDay, weekDay === currentWeekDay(), idx === 0, idx === weekDays.length - 1)
        )
    )

    const root = html('div')
    root.style.backgroundColor = 'darkseagreen'
    root.append(planControls, planDeck)

    return root
}

function planControlBtn(iconName: IconName, isFirst: boolean) {
    const size = '32px'

    const btn = button()
    btn.style.width = size
    btn.style.height = size
    btn.style.borderRadius = '50%'
    btn.style.backgroundColor = 'white'
    btn.style.fontSize = '16px'
    btn.style.color = '#333'
    btn.append(icon(iconName))

    if (!isFirst) {
        btn.style.marginLeft = '8px'
    }

    return btn
}

function planCard(cardTitle: string, isActive: boolean, isFirst: boolean, isLast: boolean) {
    const title = html('h1')
    title.style.textAlign = 'center'
    title.style.margin = '0 0 4px 0'
    title.style.color = '#333'
    title.textContent = cardTitle

    const addFoodIcon = addItemBtn('carrot', 'Add food', () => appInstance.prepend(addFoodModal()))
    const addRecipeIcon = addItemBtn('utensils', 'Add recipe', () => void 0)
    const addSmoothieIcon = addItemBtn('blender', 'Add smoothie', () => void 0)
    const addSaladIcon = addItemBtn('seedling', 'Add salad', () => void 0)

    const addPopover = html('div')
    addPopover.style.display = 'none'
    addPopover.style.backgroundColor = 'white'
    addPopover.style.borderRadius = '3px'
    addPopover.style.color = '#333'
    addPopover.style.padding = '4px'
    addPopover.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    addPopover.style.zIndex = '1'
    addPopover.style.position = 'absolute'
    addPopover.style.top = '45px'
    addPopover.style.left = '-16px'
    addPopover.append(addFoodIcon, addRecipeIcon)

    const addBtnSize = '50px'

    const addBtn = button()
    addBtn.style.display = 'none'
    addBtn.style.width = addBtnSize
    addBtn.style.height = addBtnSize
    addBtn.style.borderRadius = '50%'
    addBtn.style.backgroundColor = 'darkred'
    addBtn.style.fontSize = '24px'
    addBtn.style.color = '#eee'
    addBtn.style.padding = '0'
    addBtn.style.position = 'absolute'
    addBtn.style.bottom = '16px'
    addBtn.style.right = '16px'
    addBtn.onmouseenter = () => addPopover.style.display = 'block'
    addBtn.onmouseleave = () => addPopover.style.display = 'none'
    addBtn.append(icon('plus'), addPopover)

    const body = html('div')
    body.style.flex = '1'
    body.style.backgroundColor = 'white'
    body.style.borderRadius = '3px'
    body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    body.style.position = 'relative'
    body.onmouseenter = () => addBtn.style.display = 'block'
    body.onmouseleave = () => addBtn.style.display = 'none'
    body.append(addBtn)

    if (isActive) {
        body.style.border = '2px solid darkred'
    }

    const root = vbox({tag: 'article'})
    root.style.display = 'inline-flex'
    root.style.height = '500px'
    root.style.width = '360px'
    root.append(title, body)

    if (isFirst)
        root.style.margin = '0 8px 0 32px'
    else if (isLast)
        root.style.margin = '0 32px 0 8px'
    else
        root.style.margin = '0 8px'

    return root
}

function addItemBtn(iconName: IconName, title: string, onClick: () => void) {
    const root = icon(iconName)
    root.title = title
    root.style.padding = '8px'
    root.style.borderRadius = '3px'
    root.onmouseenter = () => root.style.backgroundColor = '#ddd'
    root.onmouseleave = () => root.style.backgroundColor = 'transparent'
    root.onclick = () => onClick()

    return root
}

function tabbedSection() {
    const tabInfo = [
        // TODO Counters.
        {name: 'Nutritional Overview', side: 'left' as 'left', content: nutritionalOverviewTab},
        {name: 'Daily Dozen', side: 'left' as 'left', content: dailyDozenTab},
        {name: 'Shopping List', side: 'right' as 'right', content: shoppingListTab}
    ]

    let tabContent: HTMLElement = html('div')

    const tabs = tabInfo.map(ti =>
        tab(ti.name, ti.side, tabs, () => {
            const nextTabContent = ti.content()
            nextTabContent.style.padding = '16px'
            root.replaceChild(nextTabContent, tabContent)
            tabContent = nextTabContent
        })
    )

    const tabList = list()
    tabList.style.padding = '0 12px'
    tabList.style.borderBottom = '1px solid #666'
    tabList.append(...tabs)

    const root = html('div')
    root.style.padding = '32px'
    root.append(tabList, tabContent)

    tabs[0].click()

    return root
}

function tab(name: string, side: 'left' | 'right', tabs: HTMLLiElement[], onClick: () => void) {
    const root = html('li')
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

function nutritionalOverviewTab() {
    const root = html('div')

    for (let i = 0; i < 16; ++i) { // FIXME
        const progressBar = html('progress')
        progressBar.max = 100
        progressBar.value = randomInt(0, 100)
        progressBar.style.display = 'block'
        progressBar.style.marginBottom = '12px'

        root.append(progressBar)
    }

    return root
}

function dailyDozenTab() {
    const categories = ['Beans', 'Berries', 'Other Fruit', 'Cruciferous Vegetables', 'Greens', 'Other Vegetables', 'Flaxseeds', 'Nuts and Seeds', 'Herbs and Spices', 'Whole Grains', 'Beverages', 'Exercise']

    const root = list()
    root.append(
        ...categories.map((cat, idx) => {
            const id = 'dailyDozenCheckbox' + idx

            const check = checkbox()
            check.id = id

            const label = html('label')
            label.htmlFor = id
            label.textContent = cat

            const item = html('li')
            item.append(check, label)

            return item
        })
    )

    return root
}

function shoppingListTab() {
    const id = 'shoppingListCheckbox1'

    const check = checkbox()
    check.id = id

    const label = html('label')
    label.htmlFor = id
    label.textContent = 'Pistachio Ice Cream'

    const item = html('li')
    item.append(check, label)

    const root = list()
    root.append(item)

    return root
}

function addFoodModal() {
    const mostUsedListTitle = html('h1')
    mostUsedListTitle.textContent = 'Most used'
    mostUsedListTitle.style.margin = '0'
    mostUsedListTitle.style.fontWeight = 'normal'
    mostUsedListTitle.style.borderBottom = '1px solid black'

    const mostUsedList = list() // TODO

    const yourCookbookListTitle = html('h1')
    yourCookbookListTitle.textContent = 'Your cookbook'
    yourCookbookListTitle.style.margin = '0'
    yourCookbookListTitle.style.fontWeight = 'normal'
    yourCookbookListTitle.style.borderBottom = '1px solid black'

    const yourCookbookList = list() // TODO

    const sidebar = html('aside')
    sidebar.style.padding = '8px 12px'
    sidebar.style.backgroundColor = '#ccc'
    sidebar.style.borderRadius = '3px 0 0 3px'
    sidebar.append(mostUsedListTitle, mostUsedList, yourCookbookListTitle, yourCookbookList)

    const findBtn = button()
    findBtn.textContent = 'Find'

    const importBtn = button()
    importBtn.textContent = 'Import'

    const newBtn = button()
    newBtn.textContent = 'New'

    const btns = [findBtn, importBtn, newBtn]
    for (let i = 1; i < btns.length; ++i) {
        btns[i].style.marginLeft = '8px'
    }

    const nav = html('nav')
    nav.style.backgroundColor = '#eee'
    nav.style.padding = '8px 12px'
    nav.style.borderTopRightRadius = '3px'
    nav.append(...btns)

    const main = html('main')
    main.style.flex = '1'
    main.style.backgroundColor = 'white'
    main.style.padding = '8px 12px'
    main.textContent = 'Main'

    const cancelBtn = button()
    cancelBtn.textContent = 'Cancel'
    cancelBtn.style.marginLeft = '8px'
    cancelBtn.style.cssFloat = 'right'
    cancelBtn.onclick = () => backdrop.remove()

    const addBtn = button()
    addBtn.textContent = 'Add'
    addBtn.style.cssFloat = 'right'

    const footer = html('footer')
    footer.style.backgroundColor = '#eee'
    footer.style.padding = '8px 12px'
    footer.style.borderBottomRightRadius = '3px'
    footer.append(cancelBtn, addBtn)

    const rightPart = vbox()
    rightPart.style.flex = '1'
    rightPart.append(nav, main, footer)

    const root = hbox({tag: 'article'})
    root.style.width = '1024px'
    root.style.maxWidth = '90%'
    root.style.position = 'absolute'
    root.style.left = '0'
    root.style.right = '0'
    root.style.margin = '32px auto'
    root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    root.append(sidebar, rightPart)

    const backdrop = html('div')
    backdrop.style.width = '100%'
    backdrop.style.height = '100%'
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    backdrop.style.position = 'fixed'
    backdrop.style.zIndex = '1'
    backdrop.style.top = '0'
    backdrop.style.left = '0'
    backdrop.append(root)

    return backdrop
}
