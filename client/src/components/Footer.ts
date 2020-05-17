import { Html } from './Html'

export function Footer() {
  return Html('footer').with(it => {
    it.style.minHeight = '200px'
    it.style.backgroundColor = '#333'
  })
}
