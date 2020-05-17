import { Html } from './Html'

export function BaseButton() {
  return Html('button').with(it => {
    it.style.cursor = 'pointer'
    it.style.border = 'none'
    it.style.padding = '0'
    it.style.outline = '0'
  })
}
