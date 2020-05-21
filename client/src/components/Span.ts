import { Html } from './Html'

export function Span(text: string) {
  return Html('span').with(it => {
    it.textContent = text
  })
}
