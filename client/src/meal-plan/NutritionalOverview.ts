export function NutritionalOverview() {
  const root = document.createElement('div')

  for (let i = 0; i < 16; ++i) {
    const progressBar = document.createElement('progress')
    progressBar.max = 100
    progressBar.value = 42
    progressBar.style.display = 'block'
    progressBar.style.marginBottom = '12px'

    root.append(progressBar)
  }

  return root
}
