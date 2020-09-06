import { Html } from '../components/Html'
import { Card } from '../components/Card'
import { Icon } from '../components/Icon'
// import { Image } from '../components/Image'
import { Recipe, removeRecipe } from './RecipeStore'
import { SaveRecipeModal } from './SaveRecipeModal'

export function RecipeCard(recipe: Recipe, saveRecipeModal: ReturnType<typeof SaveRecipeModal>) {
  const title = Html('h2').with(it => {
    it.textContent = recipe.name
    it.style.margin = '8px'
    it.style.fontWeight = '500'
    it.style.fontSize = '14px'
  })

  const root = Card().with(it => {
    it.style.display = 'inline-block'
    it.style.minWidth = '100%'
    it.style.padding = '0'
    it.style.marginBottom = '12px'

    it.append(
      // Image('https://loremflickr.com/500/400').with(it => {
      //   it.style.width = 'calc(100% + 2px)'
      //   it.style.margin = '-1px 0 0 -1px'
      // }),
      title,
      Icon('edit').with(it => {
        it.style.cursor = 'pointer'
        it.onclick = () => saveRecipeModal.open(recipe)
      }),
      Icon('trash').with(it => {
        it.style.cursor = 'pointer'
        it.style.color = 'darkred'
        it.onclick = () => {
          removeRecipe(recipe)
          root.remove()
        }
      })
    )

    return {
      matches(needle: number | string) {
        if (typeof needle === 'number') {
          return recipe.id === needle
        } else {
          return recipe.name.toLowerCase().includes(needle.toLowerCase())
        }
      },
      update(newRecipe: Recipe) {
        recipe = newRecipe
        title.textContent = recipe.name
      }
    }
  })

  return root
}
