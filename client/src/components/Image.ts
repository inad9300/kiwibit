import { Html } from './Html'

export function Image(url: string) {
  return Html('img').with(it => {
    it.src = url
  })
}
