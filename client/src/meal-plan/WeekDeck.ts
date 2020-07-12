import { FoodCard } from './FoodCard'
import { FoodCardsContainer } from './FoodCardsContainer'
import { getWeekDays } from './getWeekDays'
import { getWeekNumber } from './getWeekNumber'

const msInOneWeek = 7 * 24 * 60 * 60 * 1_000
const date = new Date()

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
    const [weekNo, weekYear] = getWeekNumber(date)
    root.setTitle(`Week ${weekNo}, ${weekYear}`)
  }

  function updateCardDates() {
    getWeekDays(date).forEach((date, idx) => foodCards[idx].setDate(date))
  }

  return root
}
