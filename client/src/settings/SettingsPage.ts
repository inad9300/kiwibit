import { Html } from '../components/Html'
import { TextField } from '../components/TextField'
import { Vbox, Hbox } from '../components/Box'
import { ControlTitle } from '../components/ControlTitle'
import { Select } from '../components/Select'
import { api } from '../utils/api'
import { Fieldset } from '../components/Fieldset'
import { groupBy } from '../utils/groupBy'
import { LabeledCheckbox } from '../components/LabeledCheckbox'
import { fetchSettings, saveSettings } from './SettingsApi'
import { toInt } from '../utils/toInt'

export function SettingsPage() {
  return Html('div').with(it => {
    it.style.padding = '12px 16px 16px'

    const ageTextField = TextField().with(it => {
      it.type = 'number'
      it.min = '0'
      it.max = '122'
    })

    const sexSelect = Select<string>('Sex', s => s.slice(0, 1), s => s).with(it => {
      it.setOptions(['Male', 'Female'])
    })

    const foodCategoriesBox = Fieldset('Food Categories').with(it => {
      it.style.marginTop = '10px'
      it.style.backgroundColor = '#fafafa'
    })

    const nutrientsBox = Fieldset('Nutrients').with(it => {
      it.style.marginTop = '10px'
      it.style.backgroundColor = '#fafafa'
    })

    const foodCategoryCheckboxes: HTMLInputElement[] = []
    const nutrientCheckboxes: HTMLInputElement[] = []

    Promise.all([
      api('getAllUsdaCategories', undefined),
      api('getAllNutrients', undefined)
    ])
    .then(async ([foodCategories, nutrients]) => {
      const settings = await fetchSettings(foodCategories, nutrients)
      return [foodCategories, nutrients, settings] as const
    })
    .then(([foodCategories, nutrients, settings]) => {
      ageTextField.value = '' + settings.age
      sexSelect.select.value = settings.sex

      foodCategories.sort((a, b) => a.name > b.name ? 1 : -1).forEach(c => {
        const labeledCheckbox = LabeledCheckbox(c.name).with(it => {
          it.checkbox.dataset.id = '' + c.id
          it.checkbox.checked = settings.food_categories.includes(c.id)
        })

        foodCategoryCheckboxes.push(labeledCheckbox.checkbox)
        foodCategoriesBox.append(
          Hbox().with(it => {
            it.append(labeledCheckbox)
          })
        )
      })

      const groupedNutrients = groupBy(nutrients, 'category')
      Object.keys(groupedNutrients).forEach(group => {
        const groupWrapper = Html('div').with(it => {
          it.style.float = 'left'
          it.style.marginRight = '16px'
        })
        groupWrapper.append(
          ControlTitle(group).with(it => {
            it.style.marginBottom = '4px'
            it.style.fontWeight = 'normal'
            it.style.paddingBottom = '2px'
            it.style.textAlign = 'center'
            it.style.color = '#444'
            it.style.borderBottom = '1px solid #999'
          })
        )
        groupedNutrients[group].forEach(n => {
          const labeledCheckbox = LabeledCheckbox(n.name + (n.alias ? ' / ' + n.alias : '')).with(it => {
            it.checkbox.dataset.id = '' + n.id
            it.checkbox.checked = settings.nutrients.includes(n.id)
          })

          nutrientCheckboxes.push(labeledCheckbox.checkbox)
          groupWrapper.append(
            Hbox().with(it => {
              it.style.marginLeft = '4px'
              it.append(labeledCheckbox)
            })
          )
        })

        nutrientsBox.append(groupWrapper)
      })

      it.oninput = () => saveSettings({
        age: toInt(ageTextField.value),
        sex: sexSelect.getSelected()!.slice(0, 1) as 'M' | 'F',
        food_categories: foodCategoryCheckboxes.filter(c => c.checked).map(c => toInt(c.dataset.id!)),
        nutrients: nutrientCheckboxes.filter(c => c.checked).map(c => toInt(c.dataset.id!))
      })
    })

    it.append(
      Hbox().with(it => {
        it.setChildren([
          Vbox().with(it => {
            it.style.minWidth = '80px'
            it.append(ControlTitle('Age'), ageTextField)
          }),
          Vbox().with(it => {
            it.style.minWidth = '80px'
            it.append(sexSelect)
          })
        ], '8px')
      }),
      foodCategoriesBox,
      nutrientsBox
    )
  })
}
