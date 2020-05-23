import { Html } from './Html'

export function Italics(text: string) {
  return Html('i').with(it => {
    it.textContent = text
  })
}
