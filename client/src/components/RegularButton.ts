import { BaseButton } from './BaseButton'

export function RegularButton(text: string) {
  return BaseButton().with(it => {
    it.textContent = text
    it.style.padding = '4px 5px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'
  })
}
