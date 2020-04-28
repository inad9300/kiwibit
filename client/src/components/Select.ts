import { Vbox } from './Box'

export function Select<O>(
  titleText: string,
  getId: (opt: O) => string | number,
  getDisplayText: (opt: O) => string
) {
  const title = document.createElement('div')
  title.textContent = titleText
  title.style.fontSize = '13px'
  title.style.fontWeight = 'bold'
  title.style.color = '#555'
  title.style.margin = '0 0 1px 4px'

  const select = document.createElement('select')
  select.style.padding = '4px 5px'
  select.style.border = '1px solid rgba(0, 0, 0, 0.15)'
  select.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
  select.style.backgroundColor = '#fff'
  select.style.outline = '0'
  select.style.cursor = 'pointer'

  const root = Vbox([title, select])

  let options: O[] = []

  return Object.assign(root, {
    setOptions(opts: O[]) {
      options = opts
      options.forEach(o => {
        const option = document.createElement('option')
        option.value = getId(o) + ''
        option.textContent = getDisplayText(o)
        select.options.add(option)
      })
    },
    getSelected(): O | undefined {
      return options.find(o => getId(o) + '' === select.value)
    }
  })
}
