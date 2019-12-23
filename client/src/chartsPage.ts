import { header } from './header'

export function chartsPage() {
  const root = document.createElement('div')
  root.append(header('charts'))

  return root
}
