import { appRoot } from '../main' // FIXME
import { weekDays, currentWeekDay } from './cal'
import { icon } from '../shared/icon'
import { style } from '../shared/style'
import { IconName } from '@fortawesome/fontawesome-common-types'
import { vbox } from '../shared/box'
import { button } from '../shared/button'
import { addFoodModal } from './addFoodModal'

export function weeklyPlanBoard() {
  const planControls = document.createElement('div')
  planControls.style.padding = '32px 0'
  planControls.style.textAlign = 'center'

  const priorWeekBtn = planControlBtn('arrow-left', true)
  const showCalendarBtn = planControlBtn('calendar-week', false)
  const nextWeekBtn = planControlBtn('arrow-right', false)
  planControls.append(priorWeekBtn, showCalendarBtn, nextWeekBtn)

  const planDeck = document.createElement('div')
  planDeck.style.textAlign = 'center'
  planDeck.style.overflowX = 'auto'
  planDeck.style.whiteSpace = 'nowrap'
  planDeck.style.paddingBottom = '32px'
  planDeck.style.cursor = 'grab'
  planDeck.append(
    ...weekDays.map((weekDay, idx) =>
      planCard(weekDay, weekDay === currentWeekDay(), idx === 0, idx === weekDays.length - 1)
    )
  )

  let x: number | undefined

  const root = document.createElement('div')
  root.style.backgroundColor = 'darkseagreen'
  root.onmousedown = evt => (x = evt.pageX)
  root.onmousemove = evt => {
    if (x !== undefined) {
      planDeck.style.cursor = 'grabbing'
      planDeck.scrollLeft += x - evt.pageX
      x = evt.pageX
    }
  }
  root.onmouseup = () => {
    planDeck.style.cursor = 'grab'
    x = undefined
  }
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
  const title = document.createElement('h1')
  title.style.textAlign = 'center'
  title.style.margin = '0 0 4px 0'
  title.style.color = '#333'
  title.textContent = cardTitle

  const addFoodIcon = addItemBtn('carrot', 'Add food', () => appRoot.prepend(addFoodModal()))
  const addRecipeIcon = addItemBtn('utensils', 'Add recipe', () => void 0)
  // const addSmoothieIcon = addItemBtn('blender', 'Add smoothie', () => void 0)
  // const addSaladIcon = addItemBtn('seedling', 'Add salad', () => void 0)

  const addPopover = document.createElement('div')
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
  addBtn.onmouseleave = () => (addPopover.style.display = 'none')
  addBtn.append(icon('plus'), addPopover)

  const body = document.createElement('div')
  body.style.flex = '1'
  body.style.backgroundColor = 'white'
  body.style.borderRadius = style.radius
  body.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'
  body.style.position = 'relative'
  body.onmouseenter = () => (addBtn.style.display = 'block')
  body.onmouseleave = () => (addBtn.style.display = 'none')
  body.append(addBtn)

  if (isActive) {
    body.style.border = '2px solid darkred'
  }

  const root = vbox([title, body], { tag: 'article' })
  root.style.display = 'inline-flex'
  root.style.height = '500px'
  root.style.width = '360px'

  if (isFirst) root.style.margin = '0 8px 0 32px'
  else if (isLast) root.style.margin = '0 32px 0 8px'
  else root.style.margin = '0 8px'

  return root
}

function addItemBtn(iconName: IconName, title: string, onClick: () => void) {
  const root = icon(iconName)
  root.title = title
  root.style.padding = '8px'
  root.style.cursor = 'pointer'
  root.style.borderRadius = style.radius
  root.onmouseenter = () => (root.style.backgroundColor = '#ddd')
  root.onmouseleave = () => (root.style.backgroundColor = 'transparent')
  root.onclick = () => onClick()

  return root
}
