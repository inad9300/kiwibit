import { Html } from './Html'
import { Checkbox } from './Checkbox'
import { Span } from './Span'

export function LabeledCheckbox(label: string) {
  return Html('label').with(it => {
    it.style.fontSize = '13px'
    it.style.cursor = 'pointer'

    const checkbox = Checkbox().with(it => {
      it.style.position = 'relative'
      it.style.top = '2px'
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
