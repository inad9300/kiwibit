import { Html } from '../components/Html'

export function CategoryCircle(color: string, size = 11) {
  return Html('div').with(it => {
    it.style.width = it.style.height = it.style.minWidth = it.style.minHeight = it.style.borderRadius = size + 'px'
    it.style.backgroundColor = color
  })
}
