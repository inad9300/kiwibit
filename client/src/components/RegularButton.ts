import { BaseButton } from './BaseButton'

export function RegularButton(text: string) {
  return BaseButton().with(it => {
    it.textContent = text
    it.style.height = '26px'
    it.style.padding = '0 5px'
    it.style.fontSize = '12px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'

    it.onmousedown = () => {
      it.style.boxShadow = 'none'
      it.style.backgroundColor = '#f4f4f4'
    }
    it.onmouseup = it.onmouseleave = () => {
      it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
      it.style.backgroundColor = '#fff'
    }
  })
}
