import { Html } from './Html'

export function ControlTitle(text: string) {
  return Html('div').with(it => {
    it.textContent = text
    it.style.fontSize = '13px'
    it.style.fontWeight = 'bold'
    it.style.color = '#555'
    it.style.margin = '0 0 1px 4px'
  })
}
