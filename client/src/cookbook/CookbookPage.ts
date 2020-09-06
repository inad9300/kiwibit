import { Html } from '../components/Html'
import { Hbox, Vbox } from '../components/Box'
import { TextField } from '../components/TextField'
import { FormControl } from '../components/FormControl'
import { RegularButton } from '../components/RegularButton'
import { Spacer } from '../components/Spacer'
import { cookbook } from './RecipeStore'
import { RecipeCard } from './RecipeCard'
import { SaveRecipeModal } from './SaveRecipeModal'

export function CookbookPage() {
  const filterInput = TextField().with(it => {
    it.style.width = '150px'
    it.placeholder = 'Recipe name'
    it.oninput = () => {
      for (const card of recipeCards.cards) {
        card.style.opacity = card.matches(filterInput.value) ? '1' : '0.2'
      }
    }
  })

  const saveRecipeModal = SaveRecipeModal().with(it => {
    it.onSave = recipe => {
      const card = recipeCards.cards.find(c => c.matches(recipe.id))
      if (card) {
        card.update(recipe)
      } else {
        recipeCards.append(RecipeCard(recipe, saveRecipeModal))
      }
    }
  })

  const addRecipeBtn = RegularButton('New recipe').with(it => {
    it.style.marginTop = '16px'
    it.onclick = () => saveRecipeModal.open()
  })

  const controlsRow = Hbox().with(it => {
    it.append(
      FormControl('Filter', filterInput),
      Spacer(),
      addRecipeBtn
    )
    it.style.marginBottom = '12px'
  })

  const recipeCards = Html('div').with(it => {
    it.style.columns = '175px'
    it.style.columnGap = '12px'
    it.append(...cookbook.map(recipe => RecipeCard(recipe, saveRecipeModal)))

    return {
      get cards() {
        return Array.from(it.children) as ReturnType<typeof RecipeCard>[]
      }
    }
  })

  return Vbox().with(it => {
    it.style.padding = '12px 16px 4px 16px'

    it.append(controlsRow, saveRecipeModal, recipeCards)
  })
}
