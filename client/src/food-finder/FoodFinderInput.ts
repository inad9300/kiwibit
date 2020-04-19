import { api } from '../shared/api'

export function FoodFinderInput(onSelect: (foodId: number) => void) {
  let usdaCategoryId = -1

  const input = document.createElement('input')
  input.placeholder = `Enter at least 3 characters, e.g. "lentils cooked"`
  input.oninput = () => input.value.length >= 3 && renderList()

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
