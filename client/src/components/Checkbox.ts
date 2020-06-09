import { Html } from './Html'

export function Checkbox() {
  return Html('input').with(it => {
    it.type = 'checkbox'
    it.style.cursor = 'pointer'
  })
}
