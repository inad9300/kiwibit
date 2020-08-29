import { Vbox } from '../components/Box'
import { fetchNutrientsSettings, fetchAgeAndSexSettings } from '../settings/SettingsApi'
import { api } from '../utils/api'
import { NutritionalOverview } from './NutritionalOverview'
import { AddFoodModal } from './AddFoodModal'
import { toInt } from '../utils/toInt'
import { foodRegistry, updateFoodRegistry } from './FoodRegistryApi'
import { WeekDeck } from './WeekDeck'

export function MealPlanPage() {
  const userNutrientIds: number[] = []

  async function getFoodFromRegistry() {
    const foodIdsWithCard = weekDeck.foodCards.flatMap(card =>
      Object
        .keys(foodRegistry[card.getDate()] || {})
        .map(foodId => ({ card, foodId: toInt(foodId) }))
    )

    const foods = await Promise.all(
      foodIdsWithCard
        .map(({ foodId }) => foodId)
        .filter((val, idx, arr) => arr.indexOf(val) === idx)
        .map(foodId =>
          api('findFoodDetails', { id: foodId, nutrients: userNutrientIds }, { cache: true })
            .then(food => ({ ...food, id: foodId }))
        )
    )

    return foodIdsWithCard.map(({ card, foodId }) => ({
      card,
      food: foods.find(f => f.id === foodId)!
    }))
  }

  async function addFoodFromRegistry() {
    (await getFoodFromRegistry()).forEach(({ card, food }) => {
      card.addFood(
        { id: food.id, name: food.name },
        foodRegistry[card.getDate()][food.id].amount
      )
    })
  }

  Promise.all([
    api('getAllNutrients', undefined, { cache: true }).then(async allNutrients => {
      const userNutrientIds = await fetchNutrientsSettings(allNutrients)
      return allNutrients.filter(({ id }) => userNutrientIds.includes(id))
    }),
    fetchAgeAndSexSettings().then(({ age, sex }) =>
      api('getIntakeMetadataForAllNutrients', { age, gender: sex }, { cache: true }).then(ims =>
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
    addFoodFromRegistry()
  })

  const weekDeck = WeekDeck().with(it => {
    it.onDateChange = () => {
      nutritionalOverview.reset()
      addFoodFromRegistry()
    }
  })

  let nextDate: string

  weekDeck.foodCards.forEach(card => {
    card.onAddFoodClick = () => {
      nextDate = card.getDate()
      addFoodModal.hidden = false
      addFoodModal.focus()
    }

    card.onAmountChange = async (foodId, amount) => {
      updateFoodRegistry(card.getDate(), foodId, amount)
      const savedFoods = await getFoodFromRegistry()
      const nutrientAmounts: { [nutrientId: number]: number } = {}
      savedFoods.forEach(({ card, food }) =>
        food.nutrients.forEach(n => {
          const nutrientAmountPerGram = (n.amount || 0) / 100
          nutrientAmounts[n.id] = nutrientAmounts[n.id] || 0
          nutrientAmounts[n.id] += foodRegistry[card.getDate()][food.id].amount * nutrientAmountPerGram
        })
      )
      nutritionalOverview.setAmounts(nutrientAmounts)
    }
  })

  const nutritionalOverview = NutritionalOverview()

  const addFoodModal = AddFoodModal().with(it => {
    it.onAddFood = async foodId => {
      foodRegistry[nextDate] = foodRegistry[nextDate] || {}

      weekDeck.findFoodCardByDate(nextDate)!.addFood({
        id: foodId,
        name: (await api('findFoodDetails', { id: foodId, nutrients: userNutrientIds }, { cache: true })).name
      }, 100)
    }
  })

  return Vbox().with(it => {
    it.append(weekDeck, nutritionalOverview, addFoodModal)
  })
}
