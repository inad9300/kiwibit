import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { Spacer } from '../components/Spacer'
import { ChangeWeekArrow } from './ChangeWeekArrow'

export function FoodCardsContainer(children: HTMLElement[]) {
  const root = Vbox().with(it => {
    it.style.backgroundColor = '#f5f5f5'
    it.style.borderBottom = '1px solid lightgrey'

    const innerContainer = Html('div').with(it => {
      it.style.padding = '8px 8px 16px 8px'
      it.style.overflowX = 'auto'
      it.style.whiteSpace = 'nowrap'

      children.forEach(child => {
        child.style.cursor = 'initial'
        child.addEventListener('mouseup', evt => {
          evt.stopPropagation()
          stopGrabbing()
        })
      })

      it.append(...children)
    })

    it.style.cursor = 'grab'

    let priorPageX: number | undefined

    it.onmousedown = evt => {
      if (evt.button === 0) {
        it.style.cursor = 'grabbing'
        priorPageX = evt.pageX
      }
    }

    it.onmousemove = evt => {
      if (priorPageX !== undefined) {
        innerContainer.scrollLeft += priorPageX - evt.pageX
        priorPageX = evt.pageX
      }
    }

    window.addEventListener('mouseup', stopGrabbing)

    function stopGrabbing() {
      it.style.cursor = 'grab'
      priorPageX = undefined
    }

    const titleElem = Html('h3').with(it => {
      it.style.userSelect = 'none'
      it.style.margin = '1px 4px 0 4px'
      it.style.fontWeight = 'normal'
      it.style.fontSize = '17px'
      it.style.color = '#888'
      it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 1)'
    })

    it.append(
      Hbox().with(it => {
        it.style.marginTop = '8px'
        it.append(
          Spacer(),
          ChangeWeekArrow('chevron-left').with(it => {
            it.onclick = () => root.onPriorWeek()
          }),
          titleElem,
          ChangeWeekArrow('chevron-right').with(it => {
            it.onclick = () => root.onNextWeek()
          }),
          Spacer()
        )
      }),
      innerContainer
    )

    return {
      onPriorWeek() {},
      onNextWeek() {},
      setTitle(text: string) {
        titleElem.textContent = text
      }
    }
  })

  return root
}
