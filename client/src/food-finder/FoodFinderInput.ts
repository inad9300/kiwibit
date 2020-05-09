import { api } from '../utils/api'
import { Vbox } from '../components/Box'

export function FoodFinderInput() {
  let usdaCategoryId = -1

  const input = document.createElement('input')
  input.placeholder = `e.g. "lentils cooked" (at least 3 characters)`
  input.oninput = () => list.update(input.value, usdaCategoryId)
  input.style.fontSize = '13px'
  input.style.padding = '4px 5px'
  input.style.width = '275px'
  input.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  input.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.065) inset'
  input.style.backgroundColor = '#fff'

  const list = TypeaheadList()

  const title = document.createElement('div')
  title.textContent = 'Food'
  title.style.fontSize = '13px'
  title.style.fontWeight = 'bold'
  title.style.color = '#555'
  title.style.margin = '0 0 1px 4px'

  const root = Vbox([title, input])
  root.style.position = 'relative'
  root.append(input, list)

  return Object.assign(root, {
    setUsdaCategoryId(id: number) {
      usdaCategoryId = id
    },
    onSelect(cb: (foodId: number) => void) {
      list.onSelect(foodId => {
        cb(foodId)
        input.value = ''
      })
    }
  })
}

function TypeaheadList() {
  const root = document.createElement('div')
  hide()
  root.style.position = 'absolute'
  root.style.top = '47px'
  root.style.padding = '4px 0'
  root.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  root.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  root.style.backgroundColor = '#fff'
  root.style.width = '275px'
  root.style.maxHeight = '350px'
  root.style.overflowY = 'auto'

  document.addEventListener('click', evt => {
    const target = evt.target as Element
    if (!root.contains(target)) {
      hide()
    }
  })

  document.addEventListener('keyup', evt => {
    if (evt.key === 'Escape') {
      hide()
    }
  })

  function hide() {
    root.style.display = 'none'
  }

  let lastAbort: () => void
  let onSelectCb: (foodId: number) => void = () => {}

  return Object.assign(root, {
    onSelect(cb: (foodId: number) => void) {
      onSelectCb = cb
    },
    update(searchTerm: string, usdaCategoryId: number) {
      lastAbort?.()

      if (searchTerm.length < 3) {
        hide()
        root.innerHTML = ''
        return
      }

      const foodsPromise = api('findFoodsByNameAndUsdaCategory', {
        foodName: searchTerm,
        usdaCategoryId
      })

      lastAbort = foodsPromise.abort

      foodsPromise.then(foods => {
        root.innerHTML = ''
        root.style.display = 'block'

        if (foods.length === 0) {
          const noResultsMsg = document.createElement('div')
          noResultsMsg.textContent = 'No results'
          noResultsMsg.style.color = '#888'
          noResultsMsg.style.fontStyle = 'italic'
          noResultsMsg.style.textAlign = 'center'

          root.append(noResultsMsg)
        } else {
          root.append(
            ...foods.map(f => {
              const item = document.createElement('div')
              item.textContent = f.name
              item.style.padding = '4px 5px'
              item.style.fontSize = '15px'
              item.style.cursor = 'pointer'
              item.onmouseenter = () => item.style.backgroundColor = '#eee'
              item.onmouseleave = () => item.style.backgroundColor = 'transparent'
              item.onclick = () => {
                hide()
                onSelectCb(f.id)
              }
              return item
            })
          )
        }
      })
    }
  })
}
