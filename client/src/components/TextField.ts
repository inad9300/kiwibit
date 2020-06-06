import { Html } from './Html'

export function TextField() {
  return Html('input').with(it => {
    it.style.height = '26px'
    it.style.minHeight = '26px'
    it.style.fontSize = '12px'
    it.style.padding = '4px 5px'
    it.style.border = '1px solid lightgrey'
    it.style.outline = 'none'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.065) inset'
    it.style.backgroundColor = '#fff'
  })
}
