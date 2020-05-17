import { Html } from './Html'

export function Abbr(text: string, title: string) {
  return Html('abbr').with(it => {
    it.textContent = text
    it.title = title
  })
}
