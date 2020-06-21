import { Html } from '../components/Html'
import { Italics } from '../components/Italics'

export function MealPlanPage() {
  return Html('div').with(it => {
    it.style.margin = '16px'
    it.style.backgroundColor = '#f5f5f5'
    it.append(
      Italics('Coming soon...').with(it => {
        it.style.width = '100%'
        it.style.position = 'absolute'
        it.style.top = '50%'
        it.style.transform = 'translateY(-50%)'
        it.style.textAlign = 'center'
        it.style.fontSize = '17px'
        it.style.color = '#555'
      })
    )
  })
}
