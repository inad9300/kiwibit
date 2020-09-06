import { Html } from './Html'

export function Backdrop() {
  return Html('div').with(it => {
    it.hidden = true
    it.onclick = () => it.hidden = true
    it.style.display = 'flex'
    it.style.justifyContent = 'center'
    it.style.width = it.style.height = '100%'
    it.style.padding = '32px'
    it.style.position = 'fixed'
    it.style.zIndex = '2'
    it.style.top = it.style.left = '0'
    it.style.backgroundColor = 'rgba(0, 0, 0, 0.32)'

    window.addEventListener('keyup', evt => {
      if (evt.key === 'Esc' || evt.key === 'Escape') {
        it.hidden = true
      }
    })
  })
}
