import { Html } from '../components/Html'
import { TextField } from '../components/TextField'
import { Vbox, Hbox } from '../components/Box'
import { ControlTitle } from '../components/ControlTitle'
import { Select } from '../components/Select'
import { api } from '../utils/api'
import { Fieldset } from '../components/Fieldset'
import { groupBy } from '../utils/groupBy'
import { LabeledCheckbox } from '../components/LabeledCheckbox'
import { fetchSettings, saveSettings } from './SettingsStore'
import { toInt } from '../utils/toInt'
import { Checkbox } from '../components/Checkbox'
import { Span } from '../components/Span'
import { Spacer } from '../components/Spacer'

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
      it.style.minWidth = 'max-content'
      it.style.marginTop = '10px'
      it.style.backgroundColor = '#fafafa'
    })

    const foodCategoryCheckboxes: HTMLInputElement[] = []
    const nutrientCheckboxes: HTMLInputElement[] = []

    Promise.all([
      fetchSettings(),
      api('getAllNutrients', undefined, { cache: true }),
      api('getAllUsdaCategories', undefined, { cache: true })
    ])
    .then(([settings, nutrients, foodCategories]) => {
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
        const groupContent = Html('div').with(it => {
          it.style.height = '432px'
          it.style.padding = '4px 0'
          it.style.overflowY = 'auto'
          it.style.border = '1px solid #ccc'
          it.style.backgroundColor = '#fff'
        })

        groupedNutrients[group].forEach(n => {
          const checkbox = Checkbox().with(it => {
            it.dataset.id = '' + n.id
            it.checked = settings.nutrients.includes(n.id)
            it.style.marginLeft = '18px'
          })

          const labeledCheckbox = Html('label').with(it => {
            it.style.display = 'flex'
            it.style.fontSize = '14px'
            it.style.padding = '2px 8px'
            it.style.cursor = 'pointer'

            it.onmouseenter = () => it.style.backgroundColor = '#f3f3f3'
            it.onmouseleave = () => it.style.backgroundColor = '#fff'

            it.append(
              Span(n.name + (n.alias ? ' / ' + n.alias : '')),
              Spacer(),
              checkbox
            )
          })

          nutrientCheckboxes.push(checkbox)
          groupContent.append(labeledCheckbox)
        })

        nutrientsBox.append(
          Vbox().with(it => {
            it.style.float = 'left'
            it.style.marginRight = '-1px'

            it.append(
              ControlTitle(group).with(it => {
                it.style.margin = '0'
                it.style.padding = '6px'
                it.style.fontWeight = 'bold'
                it.style.textAlign = 'center'
                it.style.textTransform = 'uppercase'
                it.style.fontSize = '13px'
                it.style.color = '#333'
                it.style.borderTop = it.style.borderRight = it.style.borderLeft = '1px solid #ccc'
                it.style.backgroundColor = '#eee'
              }),
              groupContent
            )
          })
        )
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
