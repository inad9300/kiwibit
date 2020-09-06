import { Html } from '../components/Html'
import { Hbox } from '../components/Box'
import { RegularButton } from '../components/RegularButton'
import { Spacer } from '../components/Spacer'
import { FormControl } from '../components/FormControl'
import { TextField } from '../components/TextField'
import { TextArea } from '../components/TextArea'
import { Backdrop } from '../components/Backdrop'
import { addRecipe, updateRecipe, Recipe } from './RecipeStore'

export function SaveRecipeModal() {
  let editMode = false

  const nameField = TextField().with(it => {
    it.required = true
    it.style.marginBottom = '8px'
  })

  const descField = TextArea().with(it => {
    it.style.resize = 'none'
    it.style.height = '200px'
    it.style.marginBottom = '8px'
  })

  const fileReader = new FileReader()
  fileReader.onload = () => {
    picturePreview.src = fileReader.result as string
    picturePreview.hidden = false
  }

  const pictureField = Html('input').with(it => {
    it.type = 'file'
    it.accept = 'image/*'
    it.onchange = () => fileReader.readAsDataURL(it.files![0])
  })

  const picturePreview = Html('img').with(it => {
    it.hidden = true
    it.style.marginTop = '5px'
    it.style.width = '200px'
    it.style.border = '1px solid lightgrey'
  })

  const saveRecipeBtn = RegularButton('Save recipe').with(it => {
    it.type = 'submit'
    it.style.marginTop = '8px'
    it.onclick = evt => {
      evt.preventDefault()

      const recipe = {
        id: Math.random(),
        name: nameField.value,
        description: descField.value,
        picture: undefined,
        ingredients: []
      }
      if (editMode) {
        updateRecipe(recipe)
      } else {
        addRecipe(recipe)
      }
      root.onSave(recipe)

      root.hidden = true
      nameField.value = descField.value = pictureField.value = ''
    }
  })

  const root = Backdrop().with(it => {
    it.append(
      Html('form').with(it => {
        it.style.width = '450px'
        it.style.height = 'min-content'
        it.style.padding = '16px'
        it.style.backgroundColor = '#fff'
        it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.3)'
        it.onclick = evt => evt.stopPropagation()
        it.append(
          FormControl('Name', nameField),
          FormControl('Description', descField),
          FormControl('Picture', pictureField),
          picturePreview,
          Hbox().with(it => {
            it.append(Spacer(), saveRecipeBtn)
          })
        )
      })
    )

    return {
      onSave(_r: Recipe) {},
      open(initialRecipe?: Recipe) {
        root.hidden = false

        if (initialRecipe) {
          editMode = true
          nameField.value = initialRecipe.name
          descField.value = initialRecipe.description
          // pictureField.value = initialRecipe.picture
        } else {
          editMode = false
        }

        nameField.focus()
      }
    }
  })

  return root
}
