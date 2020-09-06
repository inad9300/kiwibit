export interface Recipe {
  id: number
  name: string
  description: string
  picture: any
  ingredients: {
    type: 'food' | 'recipe'
    id: number
    amount: number
  }[]
}

const cookbookStr = localStorage.getItem('cookbook')

export const cookbook: Recipe[] = cookbookStr ? JSON.parse(cookbookStr) : []

export function addRecipe(r: Recipe) {
  cookbook.push(r)
  localStorage.setItem('cookbook', JSON.stringify(cookbook))
}

export function updateRecipe(r: Recipe) {
  cookbook.splice(cookbook.findIndex(({ id }) => id === r.id), 1, r)
  localStorage.setItem('cookbook', JSON.stringify(cookbook))
}

export function removeRecipe(r: Recipe) {
  cookbook.splice(cookbook.findIndex(({ id }) => id === r.id), 1)
  localStorage.setItem('cookbook', JSON.stringify(cookbook))
}
