import { Vbox } from './Box'

export function Card() {
  return Vbox().with(it => {
    it.style.padding = '8px'
    it.style.border = '1px solid lightgrey'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.background = '#fff'
  })
}
