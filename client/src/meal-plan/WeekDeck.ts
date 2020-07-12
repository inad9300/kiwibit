import { FoodCard } from './FoodCard'
import { FoodCardsContainer } from './FoodCardsContainer'
import { getWeekDays } from './getWeekDays'

const msInOneWeek = 7 * 24 * 60 * 60 * 1_000
const date = new Date()

const weekTitleFmt = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

export function WeekDeck() {
  const foodCards = getWeekDays(date).map(FoodCard)

  const root = FoodCardsContainer(foodCards).with(it => {
    it.onPriorWeek = () => {
      date.setTime(date.getTime() - msInOneWeek)
      updateTitle()
      updateCardDates()
      root.onDateChange()
    }
    it.onNextWeek = () => {
      date.setTime(date.getTime() + msInOneWeek)
      updateTitle()
      updateCardDates()
      root.onDateChange()
    }

    return {
      foodCards,
      onDateChange() {},
      findFoodCardByDate(date: string) {
        return foodCards.find(card => card.getDate() === date)
      }
    }
  })

  updateTitle()

  function updateTitle() {
    const weekDates = getWeekDays(date)
    const monday = new Date(weekDates[0])
    const sunday = new Date(weekDates[6])
    root.setTitle(`${weekTitleFmt.format(monday)} – ${weekTitleFmt.format(sunday)}`)
  }

  function updateCardDates() {
    getWeekDays(date).forEach((date, idx) => foodCards[idx].setDate(date))
  }

  return root
}
