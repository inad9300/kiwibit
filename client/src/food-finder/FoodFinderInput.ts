import { api } from '../utils/api'

export function FoodFinderInput(onSelect: (foodId: number) => void) {
  let usdaCategoryId = -1

  const input = document.createElement('input')
  input.placeholder = `e.g. "lentils cooked" (at least 3 characters)`
  input.oninput = () => input.value.length >= 3 && renderList()
  input.style.fontSize = '13px'
  input.style.padding = '4px 5px'
  input.style.marginTop = '16px'
  input.style.width = '275px'
  input.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  input.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.065) inset'
  input.style.backgroundColor = '#fff'

  const list = document.createElement('select')
  list.oninput = () => onSelect(parseInt(list.value, 10))

  async function renderList() {
    const foods = await api('findFoodsByNameAndUsdaCategory', {
      foodName: input.value,
      usdaCategoryId
    })

    const options = foods.map(f => {
      const option = document.createElement('option')
      option.value = f.id
      option.textContent = f.name
      return option
    })

    list.innerHTML = ''
    list.append(...options)
  }

  const root = document.createElement('span')
  root.append(input, list)

  return Object.assign(root, {
    setUsdaCategoryId(id: number) {
      usdaCategoryId = id
      renderList()
    }
  })
}
