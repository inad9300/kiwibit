export const tooltip = document.createElement('div')
tooltip.style.pointerEvents = 'none'
tooltip.style.fontSize = '13px'
tooltip.style.padding = '6px'
tooltip.style.display = 'none'
tooltip.style.width = 'max-content'
tooltip.style.maxWidth = '300px'
tooltip.style.position = 'fixed'
tooltip.style.zIndex = '100'
tooltip.style.color = '#fff'
tooltip.style.borderRadius = '3px'
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'

const { documentElement } = document
const { min } = Math

export function attachTooltip(content: string | HTMLElement, ref: HTMLElement) {
  ref.addEventListener('mouseenter', evt => {
    tooltip.innerHTML = ''
    tooltip.append(content)
    tooltip.style.display = 'block'
    reposition(evt)
  })
  ref.addEventListener('mousemove', reposition)
  ref.addEventListener('mouseleave', () => tooltip.style.display = 'none')

  function reposition(evt: MouseEvent) {
    const maxTop = documentElement.clientHeight - tooltip.offsetHeight
    const maxLeft = documentElement.clientWidth - tooltip.offsetWidth

    tooltip.style.top = min(maxTop, evt.clientY + 10) + 'px'
    tooltip.style.left = min(maxLeft, evt.clientX + 10) + 'px'
  }
}
