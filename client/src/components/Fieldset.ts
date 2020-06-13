import { Html } from '../components/Html'

export function Fieldset(title: string) {
  return Html('fieldset').with(it => {
    it.style.margin = '0'
    it.style.padding = '4px 8px'
    it.style.border = '1px solid lightgrey'

    it.append(
      Html('legend').with(it => {
        it.textContent = title
        it.style.padding = '0 5px'
        it.style.fontSize = '13px'
        it.style.fontWeight = 'bold'
        it.style.color = '#555'
      })
    )
  })
}
