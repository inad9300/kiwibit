import { randomInt } from './randomInt'

export function nutritionalOverview() {
  const root = document.createElement('div')

  for (let i = 0; i < 16; ++i) {
    const progressBar = document.createElement('progress')
    progressBar.max = 100
    progressBar.value = randomInt(0, 100)
    progressBar.style.display = 'block'
    progressBar.style.marginBottom = '12px'

    root.append(progressBar)
  }

  return root
}
