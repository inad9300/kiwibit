import { ControlTitle } from '../components/ControlTitle'

export function NutrientGroupTitle(text: string) {
  return ControlTitle(text).with(it => {
    it.style.margin = '0'
    it.style.padding = '6px'
    it.style.fontWeight = 'bold'
    it.style.textAlign = 'center'
    it.style.textTransform = 'uppercase'
    it.style.fontSize = '13px'
    it.style.color = '#333'
    it.style.backgroundColor = '#eee'
  })
}
