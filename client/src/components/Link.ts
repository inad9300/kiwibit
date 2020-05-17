import { Html } from './Html'

export function Link(url: string) {
  return Html('a').with(it => {
    it.href = url
    it.style.outline = '0'
    it.style.color = '#000'
    it.style.textDecoration = 'none'
  })
}
