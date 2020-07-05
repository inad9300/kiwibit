import { Vbox } from '../components/Box'
import { fetchNutrientsSettings, fetchAgeAndSexSettings } from '../settings/SettingsApi'
import { api } from '../utils/api'
import { FoodDayCard } from './FoodDayCard'
import { NutritionalOverview } from './NutritionalOverview'
import { getDatePartAsString } from '../utils/getDatePartAsString'
import { AddFoodModal } from './AddFoodModal'
import { toInt } from '../utils/toInt'
import { FoodCardsContainer } from './FoodCardsContainer'
import { foodRegistry, updateFoodRegistry } from './FoodRegistryApi'
import { getWeekDays } from './getWeekDays'
import { fetchFoodDetails } from './fetchFoodDetails'

export function MealPlanPage() {
  const userNutrientIds: number[] = []

  function daysWithFoods() {
    return foodDayCards
      .map(({ date }) => date)
      .filter(date => foodRegistry[date])
  }

  async function addFoodToCard(cardDate: string, foodId: number, amount: number) {
    foodRegistry[nextFoodDate] = foodRegistry[nextFoodDate] || {}
    foodDayCards.find(card => card.date === cardDate)!.addFood({
      id: foodId,
      name: (await fetchFoodDetails(foodId, userNutrientIds)).name
    }, amount)
  }

  Promise.all([
    api('getAllNutrients', undefined).then(async allNutrients => {
      const userNutrientIds = await fetchNutrientsSettings(allNutrients)
      return allNutrients.filter(({ id }) => userNutrientIds.includes(id))
    }),
    fetchAgeAndSexSettings().then(({ age, sex }) =>
      api('getIntakeMetadataForAllNutrients', { age, gender: sex }).then(ims =>
        ims.map(im => ({
          ...im,
          rdi: im.rdi ? im.rdi * 7 : im.rdi,
          ul: im.ul ? im.ul * 7 : im.ul
        }))
      )
    )
  ])
  .then(([userNutrients, intakeMetadata]) => {
    userNutrientIds.push(...userNutrients.map(({ id }) => id))
    nutritionalOverview.initialize(userNutrients, intakeMetadata)

    daysWithFoods().forEach(date => {
      Object
        .keys(foodRegistry[date])
        .map(toInt)
        .forEach(foodId =>
          addFoodToCard(date, foodId, foodRegistry[date][foodId].amount)
        )
    })
  })

  let nextFoodDate: string

  const addFoodModal = AddFoodModal().with(it => {
    it.onAddFood = foodId => addFoodToCard(nextFoodDate, foodId, 100)
  })

  const foodDayCards = getWeekDays(new Date).map(d =>
    FoodDayCard(d).with(it => {
      const date = getDatePartAsString(d)

      it.onAddFoodClick = () => {
        nextFoodDate = date
        addFoodModal.hidden = false
        addFoodModal.focus()
      }

      it.onAmountChange = async (foodId, amount) => {
        updateFoodRegistry(date, foodId, amount)

        const nutrientAmounts: { [nutrientId: number]: number } = {}

        await daysWithFoods().map(async date => {
          await Object
            .keys(foodRegistry[date])
            .map(toInt)
            .map(async registryFoodId => {
              (await fetchFoodDetails(registryFoodId, userNutrientIds)).nutrients.forEach(n => {
                const nutrientAmountPerGram = (n.amount || 0) / 100
                nutrientAmounts[n.id] = nutrientAmounts[n.id] || 0
                nutrientAmounts[n.id] += foodRegistry[date][registryFoodId].amount * nutrientAmountPerGram
              })
          })
        })

        Object.keys(nutrientAmounts).map(toInt).forEach(nutrientId =>
          nutritionalOverview.nutrientRows[nutrientId].setAmount(nutrientAmounts[nutrientId])
        )
      }

      return { date }
    })
  )

  const nutritionalOverview = NutritionalOverview().with(it => {
    it.style.margin = '16px'
  })

  return Vbox().with(it => {
    it.append(
      addFoodModal,
      FoodCardsContainer(foodDayCards),
      nutritionalOverview
    )
  })
}
