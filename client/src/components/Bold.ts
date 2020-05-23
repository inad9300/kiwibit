import { Html } from './Html'

export function Bold(text: string) {
  return Html('b').with(it => {
    it.textContent = text
  })
}
