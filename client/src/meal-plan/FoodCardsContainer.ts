import { Html } from '../components/Html'
import { Icon, IconName } from '../components/Icon'

export function FoodCardsContainer(children: HTMLElement[]) {
  return Html('div').with(it => {
    it.style.backgroundColor = '#f5f5f5'
    it.style.borderBottom = '1px solid lightgrey'

    const innerContainer = Html('div').with(it => {
      it.style.padding = '16px 8px'
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

    it.append(innerContainer)
  })
}

function CalendarArrow(icon: IconName) {
  return Icon(icon).with(it => {
    it.style.position = 'absolute'
    it.style.top = '50%'
    it.style.transform = 'translateY(-50%)'
  })
}
