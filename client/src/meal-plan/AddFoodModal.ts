import { Hbox, Vbox } from '../components/Box'
import { Button } from '../components/Button'
import { List } from '../components/List'

export function AddFoodModal() {
  const mostUsedListTitle = document.createElement('h1')
  mostUsedListTitle.textContent = 'Most used'
  mostUsedListTitle.style.margin = '0'
  mostUsedListTitle.style.padding = '8px 12px'
  mostUsedListTitle.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
  mostUsedListTitle.style.fontSize = '16px'
  mostUsedListTitle.style.fontWeight = 'normal'

  const mostUsedList = List()
  ;['Potato', 'Tomato'].forEach((food, idx) => {
    const li = document.createElement('li')
    li.textContent = food
    li.style.fontSize = '14px'

    if (idx === 0) li.style.padding = '3px 12px 1px 12px'
    else if (idx === 2 - 1) li.style.padding = '1px 12px 3px 12px'
    else li.style.padding = '1px 12px'

    mostUsedList.appendChild(li)
  })

  const yourCookbookListTitle = document.createElement('h1')
  yourCookbookListTitle.textContent = 'Your cookbook'
  yourCookbookListTitle.style.margin = '0'
  yourCookbookListTitle.style.padding = '8px 12px'
  yourCookbookListTitle.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'
  yourCookbookListTitle.style.fontSize = '16px'
  yourCookbookListTitle.style.fontWeight = 'normal'

  const yourCookbookList = List()
  ;['Lettuce', 'Eggplant', 'Sweet potato', 'Spinach'].forEach((food, idx) => {
    const li = document.createElement('li')
    li.textContent = food
    li.style.fontSize = '14px'

    if (idx === 0) li.style.padding = '3px 12px 1px 12px'
    else if (idx === 2 - 1) li.style.padding = '1px 12px 3px 12px'
    else li.style.padding = '1px 12px'

    yourCookbookList.appendChild(li)
  })

  const sidebar = document.createElement('aside')
  sidebar.style.backgroundColor = '#ccc'
  sidebar.style.borderRadius = `3px 0 0 3px`
  sidebar.append(mostUsedListTitle, mostUsedList, yourCookbookListTitle, yourCookbookList)

  const findBtn = Button()
  findBtn.textContent = 'Find'

  const importBtn = Button()
  importBtn.textContent = 'Import'

  const newBtn = Button()
  newBtn.textContent = 'New'

  const btns = [findBtn, importBtn, newBtn]
  btns.forEach((btn, idx) => {
    btn.style.position = 'relative'
    btn.style.left = `-${idx}px`
    btn.style.padding = '4px 8px'
    btn.style.backgroundColor = 'white'
    btn.style.border = '1px solid rgba(0, 0, 0, 0.2)'

    if (idx === 0) btn.style.borderRadius = `3px 0 0 3px`
    else if (idx === btns.length - 1) btn.style.borderRadius = `0 3px 3px 0`
    else btn.style.borderRadius = '0'
  })

  const cancelBtn = Button()
  cancelBtn.textContent = 'Cancel'
  cancelBtn.style.padding = '4px 8px'
  cancelBtn.style.borderRadius = '3px'
  cancelBtn.style.backgroundColor = '#333'
  cancelBtn.style.color = 'white'
  cancelBtn.style.cssFloat = 'right'
  cancelBtn.onclick = () => backdrop.remove()

  const nav = document.createElement('nav')
  nav.style.backgroundColor = '#eee'
  nav.style.padding = '8px 12px'
  nav.style.borderTopRightRadius = '3px'
  nav.append(...btns, cancelBtn)

  const main = document.createElement('main')
  main.style.flex = '1'
  main.style.backgroundColor = 'white'
  main.style.padding = '8px 12px'
  main.textContent = 'Main'

  const rightPart = Vbox([nav, main])
  rightPart.style.flex = '1'

  const root = Hbox([sidebar, rightPart], { tag: 'article' })
  root.style.width = '1024px'
  root.style.maxWidth = '90%'
  root.style.position = 'absolute'
  root.style.left = '0'
  root.style.right = '0'
  root.style.margin = '32px auto'
  root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.2)'

  const backdrop = document.createElement('div')
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
