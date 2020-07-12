import { Vbox } from '../components/Box'
import { fetchNutrientsSettings, fetchAgeAndSexSettings } from '../settings/SettingsApi'
import { api } from '../utils/api'
import { NutritionalOverview } from './NutritionalOverview'
import { AddFoodModal } from './AddFoodModal'
import { toInt } from '../utils/toInt'
import { foodRegistry, updateFoodRegistry } from './FoodRegistryApi'
import { fetchFoodDetails } from './fetchFoodDetails'
import { WeekDeck } from './WeekDeck'
import type { FoodCard } from './FoodCard'

export function MealPlanPage() {
  const userNutrientIds: number[] = []

  function daysWithFoods() {
    return weekDeck
      .foodCards
      .map(card => card.getDate())
      .filter(date => foodRegistry[date])
  }

  async function addFoodToCard(card: ReturnType<typeof FoodCard>, foodId: number, amount: number) {
    foodRegistry[nextFoodDate] = foodRegistry[nextFoodDate] || {}
    card.addFood({
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
      const card = weekDeck.findFoodCardByDate(date)!
      Object
        .keys(foodRegistry[date])
        .map(toInt)
        .forEach(foodId => addFoodToCard(card, foodId, foodRegistry[date][foodId].amount))
    })
  })

  const weekDeck = WeekDeck().with(it => {
    it.onDateChange = () => {
      nutritionalOverview.reset()

      daysWithFoods().forEach(date => {
        const card = weekDeck.findFoodCardByDate(date)!
        Object
          .keys(foodRegistry[date])
          .map(toInt)
          .forEach(foodId => addFoodToCard(card, foodId, foodRegistry[date][foodId].amount))
      })
    }
  })

  let nextFoodDate: string

  weekDeck.foodCards.forEach(card => {
    card.onAddFoodClick = () => {
      nextFoodDate = card.getDate()
      addFoodModal.hidden = false
      addFoodModal.focus()
    }

    card.onAmountChange = async (foodId, amount) => {
      updateFoodRegistry(card.getDate(), foodId, amount)

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
        nutritionalOverview
          .nutrientRows[nutrientId]
          .setAmount(nutrientAmounts[nutrientId])
      )
    }
  })

  const nutritionalOverview = NutritionalOverview()

  const addFoodModal = AddFoodModal().with(it => {
    it.onAddFood = foodId => addFoodToCard(weekDeck.findFoodCardByDate(nextFoodDate)!, foodId, 100)
  })

  return Vbox().with(it => {
    it.append(
      weekDeck,
      nutritionalOverview,
      addFoodModal
    )
  })
}
