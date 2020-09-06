import { Html } from './Html'

export function TextArea() {
  return Html('textarea').with(it => {
    it.style.minHeight = '26px'
    it.style.fontSize = '12px'
    it.style.fontFamily = 'system-ui, sans-serif'
    it.style.padding = '4px 5px'
    it.style.border = '1px solid lightgrey'
    it.style.outline = 'none'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.065) inset'
    it.style.backgroundColor = '#fff'
  })
}
