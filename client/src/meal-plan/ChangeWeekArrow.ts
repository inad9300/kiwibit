import { Icon } from '../components/Icon'

export function ChangeWeekArrow(icon: 'chevron-left' | 'chevron-right') {
  return Icon(icon).with(it => {
    it.style.display = 'inline'
    it.style.width = it.style.height = it.style.borderRadius = '22px'
    it.style.padding = '3px'
    if (icon === 'chevron-left') {
      it.style.paddingLeft = '1px'
    } else {
      it.style.paddingRight = '1px'
    }
    it.style.cursor = 'pointer'
    it.onmouseenter = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
    it.onmouseleave = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0)'
  })
}
