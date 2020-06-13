import { Html } from './Html'

export function LinkButton(text: string, url: string) {
  return Html('a').with(it => {
    it.textContent = text
    it.href = url

    it.style.display = 'inline-block'
    it.style.outline = '0'
    it.style.textDecoration = 'none'
    it.style.color = '#000'
    it.style.height = '26px'
    it.style.minHeight = '26px'
    it.style.padding = '5px'
    it.style.fontSize = '12px'
    it.style.border = '1px solid lightgrey'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'

    function activate() {
      it.style.boxShadow = 'none'
      it.style.backgroundColor = '#f4f4f4'
    }

    let pressed = false

    window.addEventListener('mouseup', () => pressed = false)

    it.onmousedown = () => {
      activate()
      pressed = true
    }

    it.onmouseenter = () => {
      if (pressed) {
        activate()
      }
    }

    it.onmouseup = it.onmouseleave = () => {
      it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
      it.style.backgroundColor = '#fff'
    }
  })
}
