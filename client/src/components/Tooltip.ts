import { Html } from './Html'

export function Tooltip() {
  return Html('div').with(it => {
    it.hidden = true
    it.style.pointerEvents = 'none'
    it.style.fontSize = '13px'
    it.style.padding = '6px'
    it.style.minWidth = 'max-content'
    it.style.maxWidth = '300px'
    it.style.position = 'fixed'
    it.style.zIndex = '100'
    it.style.color = '#fff'
    it.style.borderRadius = '3px'
    it.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'

    const { documentElement } = document
    const { min } = Math

    function reposition(evt: MouseEvent) {
      const maxTop = documentElement.clientHeight - it.offsetHeight
      const maxLeft = documentElement.clientWidth - it.offsetWidth

      it.style.top = min(maxTop, evt.clientY + 10) + 'px'
      it.style.left = min(maxLeft, evt.clientX + 10) + 'px'
    }

    return {
      attach(content: string | HTMLElement, ref: HTMLElement) {
        if (content instanceof HTMLElement) {
          content.style.maxWidth = '300px'
        }

        ref.addEventListener('mouseenter', evt => {
          it.innerHTML = ''
          it.append(content)
          it.hidden = false
          reposition(evt)
        })
        ref.addEventListener('mousemove', reposition)
        ref.addEventListener('mouseleave', () => it.hidden = true)
      }
    }
  })
}
