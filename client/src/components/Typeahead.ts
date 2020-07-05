import { Html } from './Html'
import { Vbox } from './Box'
import { TextField } from './TextField'
import { ControlTitle } from './ControlTitle'
import { AbortablePromise } from '../utils/api'

type TypeaheadListItem<R> = HTMLDivElement & {
  result: R
  select(): void
  deselect(): void
  isSelected(): boolean
}

export function Typeahead<R>(
  titleText: string,
  placeholder: string,
  searchFn: (searchTerm: string) => AbortablePromise<R[]>,
  getDisplayText: (result: R) => string
) {
  const textField = TextField().with(it => {
    it.placeholder = placeholder
    it.oninput = () => list.update(it.value)
    it.onkeydown = async evt => {
      if (evt.key === 'ArrowDown') {
        if (list.hidden) {
          await list.update(it.value)
        }
        list.selectNext()
      } else if (evt.key === 'ArrowUp') {
        if (list.hidden) {
          await list.update(it.value)
        }
        list.selectPrior()
      } else if (evt.key === 'Enter') {
        list.confirmSelection()
      }
    }
  })

  const list = Html('div').with(it => {
    it.hidden = true
    it.style.position = 'absolute'
    it.style.zIndex = '1'
    it.style.top = '47px'
    it.style.padding = '4px 0'
    it.style.border = '1px solid lightgrey'
    it.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.08)'
    it.style.backgroundColor = '#fff'
    it.style.minWidth = '100%'
    it.style.width = 'max-content'
    it.style.maxWidth = '400px'
    it.style.maxHeight = '400px'
    it.style.overflowY = 'auto'
    it.style.fontSize = '14px'

    let lastAbort: () => void

    const items: TypeaheadListItem<R>[] = []

    return {
      selectNext() {
        if (items.length > 0) {
          const idx = items.findIndex(item => item.isSelected())
          if (idx > -1) {
            items[idx].deselect()
          }

          const nextIdx = idx === -1 || idx === items.length - 1 ? 0 : idx + 1
          items[nextIdx].select()
          items[nextIdx].scrollIntoView({ block: 'nearest' })
        }
      },
      selectPrior() {
        if (items.length > 0) {
          const idx = items.findIndex(item => item.isSelected())
          if (idx > -1) {
            items[idx].deselect()
          }

          const priorIdx = idx === -1 || idx === 0 ? items.length - 1 : idx - 1
          items[priorIdx].select()
          items[priorIdx].scrollIntoView({ block: 'nearest' })
        }
      },
      confirmSelection() {
        const idx = items.findIndex(item => item.isSelected())
        if (idx > -1) {
          selectResult(items[idx].result)
        }
      },
      async update(searchTerm: string) {
        lastAbort?.()

        if (searchTerm.length < 3) {
          list.hidden = true
          list.innerHTML = ''
          return
        }

        const promise = searchFn(searchTerm)
        lastAbort = promise.abort
        const results = await promise

        items.length = 0
        list.innerHTML = ''
        list.hidden = false

        if (results.length === 0) {
          list.append(
            Html('div').with(it => {
              it.textContent = 'No results'
              it.style.color = '#888'
              it.style.fontStyle = 'italic'
              it.style.textAlign = 'center'
            })
          )
        } else {
          items.push(
            ...results.map(result => Html('div').with(it => {
              function select() {
                it.style.backgroundColor = '#eee'
                it.dataset.selected = 'yes'
              }

              function deselect() {
                it.style.backgroundColor = 'transparent'
                delete it.dataset.selected
              }

              it.textContent = getDisplayText(result)
              it.style.padding = '4px 8px'
              it.style.cursor = 'pointer'
              it.onmouseenter = () => {
                items.forEach(item => item.deselect())
                select()
              }
              it.onmouseleave = () => deselect()
              it.onclick = () => selectResult(result)

              return {
                result,
                select,
                deselect,
                isSelected: () => it.dataset.selected === 'yes'
              }
            }))
          )
          list.append(...items)
        }
      }
    }
  })

  document.addEventListener('click', evt => {
    const target = evt.target as Element
    if (!list.contains(target)) {
      list.hidden = true
    }
  })

  document.addEventListener('keyup', evt => {
    if (evt.key === 'Escape') {
      list.hidden = true
    }
  })

  const root = Vbox().with(it => {
    it.style.position = 'relative'
    it.append(ControlTitle(titleText), textField, list)

    return {
      onSelect(_result: R) {},
      focus() {
        textField.focus()
      }
    }
  })

  function selectResult(result: R) {
    textField.value = ''
    list.hidden = true
    root.onSelect(result)
  }

  return root
}
