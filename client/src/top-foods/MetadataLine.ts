import { Html } from '../components/Html'

export function MetadataLine(width: string, color: string) {
  return Html('div').with(it => {
    it.style.height = '100%'
    it.style.position = 'absolute'
    it.style.top = '0'
    it.style.left = '0'
    it.style.width = width
    it.style.borderRight = `1px solid ${color}`
  })
}
