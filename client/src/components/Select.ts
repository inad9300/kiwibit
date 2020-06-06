import { Html } from './Html'
import { Vbox } from './Box'
import { Icon } from './Icon'
import { ControlTitle } from './ControlTitle'

export function Select<O>(
  titleText: string,
  getId: (opt: O) => string | number,
  getDisplayText: (opt: O) => string
) {
  const select = Html('select').with(it => {
    it.style.height = '26px'
    it.style.minHeight = '26px'
    it.style.webkitAppearance = 'none'
    it.style.borderRadius = '0'
    it.style.margin = '0'
    it.style.padding = '0 18px 0 5px'
    it.style.border = '1px solid lightgrey'
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
      ControlTitle(titleText),
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
