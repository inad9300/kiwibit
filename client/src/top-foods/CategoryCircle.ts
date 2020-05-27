import { Html } from '../components/Html'

export function CategoryCircle(color: string) {
  return Html('div').with(it => {
    it.style.width = it.style.height = it.style.minWidth = it.style.minHeight = it.style.borderRadius = '11px'
    it.style.backgroundColor = color
  })
}
