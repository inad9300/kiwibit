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

// TODO Move to separate file.
const style = {
    radius: '3px'
}

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
    // const addSmoothieIcon = addItemBtn('blender', 'Add smoothie', () => void 0)
    // const addSaladIcon = addItemBtn('seedling', 'Add salad', () => void 0)

    const addPopover = html('div')
    addPopover.style.display = 'none'
    addPopover.style.backgroundColor = 'white'
    addPopover.style.borderRadius = style.radius
    addPopover.style.color = '#333'
    addPopover.style.padding = '4px'
    addPopover.style.border = '1px solid darkred'
    addPopover.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    addPopover.style.zIndex = '1'
    addPopover.style.position = 'absolute'
    addPopover.style.top = '5px'
    addPopover.append(addFoodIcon, addRecipeIcon)

    const addBtn = button()
    addBtn.style.display = 'none'
    const addBtnSize = 60
    addBtn.style.width = addBtn.style.height = addBtnSize + 'px'
    addBtn.style.borderRadius = '50%'
    addBtn.style.cursor = 'default'
    addBtn.style.backgroundColor = 'darkred'
    addBtn.style.fontSize = '24px'
    addBtn.style.color = '#eee'
    addBtn.style.padding = '0'
    addBtn.style.position = 'absolute'
    addBtn.style.bottom = '16px'
    addBtn.style.right = '16px'
    addBtn.onmouseenter = () => {
        addPopover.style.display = 'block'
        addPopover.style.left = '-' + Math.floor((addPopover.offsetWidth - addBtnSize) / 2) + 'px'
    }
    addBtn.onmouseleave = () => addPopover.style.display = 'none'
    addBtn.append(icon('plus'), addPopover)

    const body = html('div')
    body.style.flex = '1'
    body.style.backgroundColor = 'white'
    body.style.borderRadius = style.radius
    body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
    body.style.position = 'relative'
    body.onmouseenter = () => addBtn.style.display = 'block'
    body.onmouseleave = () => addBtn.style.display = 'none'
    body.append(addBtn)

    if (isActive) {
        body.style.border = '2px solid darkred'
    }

    const root = vbox([title, body], {tag: 'article'})
    root.style.display = 'inline-flex'
    root.style.height = '500px'
    root.style.width = '360px'

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
    root.style.cursor = 'pointer'
    root.style.borderRadius = style.radius
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

    const tabs: HTMLLIElement[] = []
    tabInfo.forEach(ti => tabs.push(
        tab(ti.name, ti.side, tabs, () => {
            const nextTabContent = ti.content()
            nextTabContent.style.padding = '16px'
            root.replaceChild(nextTabContent, tabContent)
            tabContent = nextTabContent
        })
    ))

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

function tab(name: string, side: 'left' | 'right', tabs: HTMLLIElement[], onClick: () => void) {
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
    mostUsedListTitle.style.padding = '8px 12px'
    mostUsedListTitle.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
    mostUsedListTitle.style.fontSize = '16px'
    mostUsedListTitle.style.fontWeight = 'normal'

    const mostUsedList = list()
    ;['Potato', 'Tomato'].forEach((food, idx) => {
        const li = html('li')
        li.textContent = food
        li.style.fontSize = '14px'

        if (idx === 0)
            li.style.padding = '3px 12px 1px 12px'
        else if (idx === (2 - 1))
            li.style.padding = '1px 12px 3px 12px'
        else
            li.style.padding = '1px 12px'

        mostUsedList.appendChild(li)
    })

    const yourCookbookListTitle = html('h1')
    yourCookbookListTitle.textContent = 'Your cookbook'
    yourCookbookListTitle.style.margin = '0'
    yourCookbookListTitle.style.padding = '8px 12px'
    yourCookbookListTitle.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
    yourCookbookListTitle.style.fontSize = '16px'
    yourCookbookListTitle.style.fontWeight = 'normal'

    const yourCookbookList = list()
    ;['Lettuce', 'Eggplant', 'Sweet potato', 'Spinach'].forEach((food, idx) => {
        const li = html('li')
        li.textContent = food
        li.style.fontSize = '14px'

        if (idx === 0)
            li.style.padding = '3px 12px 1px 12px'
        else if (idx === (2 - 1))
            li.style.padding = '1px 12px 3px 12px'
        else
            li.style.padding = '1px 12px'

        yourCookbookList.appendChild(li)
    })

    const sidebar = html('aside')
    sidebar.style.backgroundColor = '#ccc'
    sidebar.style.borderRadius = `${style.radius} 0 0 ${style.radius}`
    sidebar.append(mostUsedListTitle, mostUsedList, yourCookbookListTitle, yourCookbookList)

    const findBtn = button()
    findBtn.textContent = 'Find'

    const importBtn = button()
    importBtn.textContent = 'Import'

    const newBtn = button()
    newBtn.textContent = 'New'

    const btns = [findBtn, importBtn, newBtn]
    btns.forEach((btn, idx) => {
        btn.style.position = 'relative'
        btn.style.left = `-${idx}px`
        btn.style.padding = '4px 8px'
        btn.style.backgroundColor = 'white'
        btn.style.border = '1px solid rgba(0, 0, 0, 0.2)'

        if (idx === 0)
            btn.style.borderRadius = `${style.radius} 0 0 ${style.radius}`
        else if (idx === btns.length - 1)
            btn.style.borderRadius = `0 ${style.radius} ${style.radius} 0`
        else
            btn.style.borderRadius = '0'
    })

    const cancelBtn = button()
    cancelBtn.textContent = 'Cancel'
    cancelBtn.style.padding = '4px 8px'
    cancelBtn.style.borderRadius = style.radius
    cancelBtn.style.backgroundColor = '#333'
    cancelBtn.style.color = 'white'
    cancelBtn.style.cssFloat = 'right'
    cancelBtn.onclick = () => backdrop.remove()

    const nav = html('nav')
    nav.style.backgroundColor = '#eee'
    nav.style.padding = '8px 12px'
    nav.style.borderTopRightRadius = style.radius
    nav.append(...btns, cancelBtn)

    const main = html('main')
    main.style.flex = '1'
    main.style.backgroundColor = 'white'
    main.style.padding = '8px 12px'
    main.textContent = 'Main'

    const rightPart = vbox([nav, main])
    rightPart.style.flex = '1'

    const root = hbox([sidebar, rightPart], {tag: 'article'})
    root.style.width = '1024px'
    root.style.maxWidth = '90%'
    root.style.position = 'absolute'
    root.style.left = '0'
    root.style.right = '0'
    root.style.margin = '32px auto'
    root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'

    const backdrop = html('div')
    backdrop.style.width = '100%'
    backdrop.style.height = '100%'
    backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'
    backdrop.style.position = 'fixed'
    backdrop.style.zIndex = '2'
    backdrop.style.top = '0'
    backdrop.style.left = '0'
    backdrop.append(root)

    return backdrop
}
