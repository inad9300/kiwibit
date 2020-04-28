export const tooltip = document.createElement('div')
tooltip.style.pointerEvents = 'none'
tooltip.style.fontSize = '13px'
tooltip.style.padding = '6px'
tooltip.style.display = 'none'
tooltip.style.position = 'fixed'
tooltip.style.zIndex = '100'
tooltip.style.color = '#fff'
tooltip.style.borderRadius = '3px'
tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'

// FIXME Can go out of screen!
// TODO Add minWidth

export function attachTooltip(content: string | HTMLElement, ref: HTMLElement) {
  ref.addEventListener('mouseenter', evt => {
    tooltip.innerHTML = ''
    tooltip.append(content)
    reposition(evt)
    tooltip.style.display = 'block'
  })
  ref.addEventListener('mousemove', reposition)
  ref.addEventListener('mouseleave', () => tooltip.style.display = 'none')

  function reposition(evt: MouseEvent) {
    tooltip.style.top = evt.clientY - 2 + 'px'
    tooltip.style.left = evt.clientX + 16 + 'px'
  }
}
