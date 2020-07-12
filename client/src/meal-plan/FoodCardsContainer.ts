import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { Icon } from '../components/Icon'
import { Spacer } from '../components/Spacer'
import type { FoodDayCard } from './FoodDayCard'

export function FoodCardsContainer(title: string, children: ReturnType<typeof FoodDayCard>[]) {
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

    it.append(
      Hbox().with(it => {
        it.style.marginTop = '8px'
        it.append(
          Spacer(),
          CalendarArrow('chevron-left').with(it => {
            it.style.paddingLeft = '1px'
            it.onclick = () => root.onPriorWeek()
          }),
          Html('h3').with(it => {
            it.textContent = title
            it.style.userSelect = 'none'
            it.style.margin = '1px 4px 0 4px'
            it.style.fontWeight = 'normal'
            it.style.fontSize = '17px'
            it.style.color = '#888'
            it.style.textShadow = '0 1px 0 rgba(255, 255, 255, 1)'
          }),
          CalendarArrow('chevron-right').with(it => {
            it.style.paddingRight = '1px'
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
      reset() {
        children.forEach(child => child.reset())
      }
    }
  })

  return root
}

function CalendarArrow(icon: 'chevron-left' | 'chevron-right') {
  return Icon(icon).with(it => {
    it.style.display = 'inline'
    it.style.width = it.style.height = it.style.borderRadius = '22px'
    it.style.padding = '3px'
    it.style.cursor = 'pointer'
    it.onmouseenter = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
    it.onmouseleave = () => it.style.backgroundColor = 'rgba(0, 0, 0, 0)'
  })
}
