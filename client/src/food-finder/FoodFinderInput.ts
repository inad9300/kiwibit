import { api } from '../utils/api'
import { Html } from '../components/Html'
import { Vbox } from '../components/Box'

export function FoodFinderInput() {
  let usdaCategoryId = -1

  const input = Html('input').with(it => {
    it.placeholder = `e.g. "lentils cooked" (at least 3 characters)`
    it.oninput = () => list.update(it.value, usdaCategoryId)
    it.style.height = '26px'
    it.style.minHeight = '26px'
    it.style.fontSize = '12px'
    it.style.padding = '4px 5px'
    it.style.width = '275px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.borderLeft = '0'
    it.style.outline = 'none'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.065) inset'
    it.style.backgroundColor = '#fff'
  })

  const list = TypeaheadList().with(it => {
    it.onSelect = (foodId: number) => {
      root.onSelect(foodId)
      input.value = ''
    }
  })

  const title = Html('div').with(it => {
    it.textContent = 'Food'
    it.style.fontSize = '13px'
    it.style.fontWeight = 'bold'
    it.style.color = '#555'
    it.style.margin = '0 0 1px 4px'
  })

  const root = Vbox().with(it => {
    it.append(title, input)
    it.style.position = 'relative'
    it.append(input, list)

    return {
      setUsdaCategoryId(id: number) {
        usdaCategoryId = id
      },
      onSelect: (_foodId: number) => {}
    }
  })

  return root
}

function TypeaheadList() {
  const root = Html('div').with(it => {
    it.hidden = true
    it.style.position = 'absolute'
    it.style.zIndex = '1'
    it.style.top = '47px'
    it.style.padding = '4px 0'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'
    it.style.width = '275px'
    it.style.maxHeight = '350px'
    it.style.overflowY = 'auto'

    let lastAbort: () => void

    return {
      onSelect: (_foodId: number) => {},
      update(searchTerm: string, usdaCategoryId: number) {
        lastAbort?.()

        if (searchTerm.length < 3) {
          root.hidden = true
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
          root.hidden = false

          if (foods.length === 0) {
            const noResultsMsg = Html('div').with(it => {
              it.textContent = 'No results'
              it.style.color = '#888'
              it.style.fontStyle = 'italic'
              it.style.textAlign = 'center'
            })

            root.append(noResultsMsg)
          } else {
            root.append(
              ...foods.map(f => Html('div').with(it => {
                it.textContent = f.name
                it.style.padding = '4px 5px'
                it.style.fontSize = '15px'
                it.style.cursor = 'pointer'
                it.onmouseenter = () => it.style.backgroundColor = '#eee'
                it.onmouseleave = () => it.style.backgroundColor = 'transparent'
                it.onclick = () => {
                  root.hidden = true
                  root.onSelect(f.id)
                }
              }))
            )
          }
        })
      }
    }
  })

  document.addEventListener('click', evt => {
    const target = evt.target as Element
    if (!root.contains(target)) {
      root.hidden = true
    }
  })

  document.addEventListener('keyup', evt => {
    if (evt.key === 'Escape') {
      root.hidden = true
    }
  })

  return root
}
