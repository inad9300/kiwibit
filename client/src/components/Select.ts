import { Html } from './Html'
import { Vbox } from './Box'
import { Icon } from './Icon'

export function Select<O>(
  titleText: string,
  getId: (opt: O) => string | number,
  getDisplayText: (opt: O) => string
) {
  const title = Html('div').with(it => {
    it.textContent = titleText
    it.style.fontSize = '13px'
    it.style.fontWeight = 'bold'
    it.style.color = '#555'
    it.style.margin = '0 0 1px 4px'
  })

  const select = Html('select').with(it => {
    it.style.height = '26px'
    it.style.webkitAppearance = 'none'
    it.style.borderRadius = '0'
    it.style.padding = '0 18px 0 5px'
    it.style.border = '1px solid rgba(0, 0, 0, 0.15)'
    it.style.fontSize = '12px'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'
    it.style.outline = '0'
    it.style.cursor = 'pointer'
  })

  let options: O[] = []

  return Vbox().with(it => {
    it.style.position = 'relative'
    it.append(
      title,
      select,
      Icon('chevron-down').with(it => {
        it.style.fontSize = '12px'
        it.style.color = '#666'
        it.style.position = 'absolute'
        it.style.bottom = '6px'
        it.style.right = '5px'
        it.style.pointerEvents = 'none'
      })
    )

    return {
      setOptions(opts: O[]) {
        options = opts
        options.forEach(o => {
          select.options.add(
            Html('option').with(it => {
              it.value = getId(o) + ''
              it.textContent = getDisplayText(o)
            })
          )
        })
      },
      getSelected(): O | undefined {
        return options.find(o => getId(o) + '' === select.value)
      },
      setSelected(id: string | number) {
        select.value = id + ''
      }
    }
  })
}
