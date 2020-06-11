import { Html } from '../components/Html'
import { TextField } from '../components/TextField'
import { Vbox, Hbox } from '../components/Box'
import { ControlTitle } from '../components/ControlTitle'
import { Select } from '../components/Select'
import { api } from '../utils/api'
import { Fieldset } from '../components/Fieldset'
import { groupBy } from '../utils/groupBy'
import { LabeledCheckbox } from '../components/LabeledCheckbox'

export function SettingsPage() {
  return Html('div').with(it => {
    it.style.padding = '12px 16px 16px'

    const foodCategoriesBox = Fieldset('Food Categories').with(it => {
      it.style.marginTop = '10px'
    })

    api('getAllUsdaCategories', undefined).then(categories => {
      categories
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(c => {
          return Hbox().with(it => {
            it.append(
              LabeledCheckbox(c.name).with(it => {
                it.checkbox.checked = c.is_visible_default
              })
            )
          })
        })
        .forEach(c => foodCategoriesBox.append(c))
    })

    const nutrientsBox = Fieldset('Nutrients').with(it => {
      it.style.marginTop = '10px'
    })

    api('getAllNutrients', undefined).then(nutrients => {
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
            it.style.borderBottom = '1px solid #aaa'
          })
        )
        groupedNutrients[group]
          .map(n => {
            return Hbox().with(it => {
              it.style.marginLeft = '4px'
              it.append(
                LabeledCheckbox(n.name + (n.alias ? ' / ' + n.alias : '')).with(it => {
                  it.checkbox.checked = n.is_visible_default
                })
              )
            })
          })
          .forEach(n => groupWrapper.append(n))

        nutrientsBox.append(groupWrapper)
      })
    })

    it.append(
      Hbox().with(it => {
        it.append(
          Vbox().with(it => {
            it.style.marginRight = '8px'
            it.style.minWidth = '80px'
            it.append(
              ControlTitle('Age'),
              TextField().with(it => {
                it.type = 'number'
                it.min = '0'
                it.max = '122'
                it.value = '25'
              })
            )
          }),
          Vbox().with(it => {
            it.style.minWidth = '80px'
            it.append(
              Select<string>('Sex', s => s, s => s).with(it => {
                it.setOptions([
                  'Male',
                  'Female'
                ])
              })
            )
          })
        )
      }),
      foodCategoriesBox,
      nutrientsBox
    )
  })
}
