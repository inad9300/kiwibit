import { Html } from './Html'

export function Spacer() {
  return Html('div').with(it => {
    it.style.flex = '1'
  })
}
