import { Html } from './Html'
import { Checkbox } from './Checkbox'
import { Span } from './Span'

export function LabeledCheckbox(label: string) {
  return Html('label').with(it => {
    it.style.fontSize = '13px'

    const checkbox = Checkbox().with(it => {
      it.type = 'checkbox'
      it.style.cursor = 'pointer'
    })

    it.append(
      checkbox,
      Span(label).with(it => {
        it.style.marginLeft = '2px'
      })
    )

    return { checkbox }
  })
}
