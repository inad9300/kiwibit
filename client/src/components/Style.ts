import { Html } from './Html'

export function Style(text: string) {
  return Html('style').with(it => {
    it.textContent = text
  })
}
