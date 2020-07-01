import { Html } from '../components/Html'
import { Vbox, Hbox } from '../components/Box'
import { FoodFinderInput } from '../food-finder/FoodFinderInput'
import { fetchFoodCategoriesSettings, fetchNutrientsSettings, fetchAgeAndSexSettings } from '../settings/SettingsApi'
import { api, ApiOutput } from '../utils/api'
import { Card } from '../components/Card'
import { List } from '../components/List'
import { groupBy } from '../utils/groupBy'
import { ControlTitle } from '../components/ControlTitle'
import { Span } from '../components/Span'
import { Spacer } from '../components/Spacer'
import { pct } from '../utils/pct'
import { tooltip } from '../main'
import { TextField } from '../components/TextField'
import { Page } from '../pages'
import { Link } from '../components/Link'

export function MealPlanPage() {
  const intakeMetadata: ApiOutput<'getIntakeMetadataForAllNutrients'> = []
  const userNutrients: ApiOutput<'getAllNutrients'> = []

  api('getAllUsdaCategories', undefined)
    .then(fetchFoodCategoriesSettings)
    .then(userCategories => foodFinderInput.setUsdaCategoryIds(userCategories))

  fetchAgeAndSexSettings().then(async ({ age, sex }) => {
    intakeMetadata.push(
      ...await api('getIntakeMetadataForAllNutrients', { age, gender: sex })
    )
  })

  const nutrientRows: {
    [nutrientId: number]: HTMLElement & {
      getAmount: () => number
      setAmount: (a: number) => void
    }
  } = {}

  api('getAllNutrients', undefined).then(async allNutrients => {
    const userNutrientIds = await fetchNutrientsSettings(allNutrients)
    userNutrients.push(
      ...allNutrients.filter(({ id }) => userNutrientIds.includes(id))
    )

    const groupedNutrients = groupBy(userNutrients, 'category')
    Object.keys(groupedNutrients).forEach(group => {
      const groupContent = Html('div').with(it => {
        it.style.height = '452px'
        it.style.overflowY = 'auto'
        it.style.fontSize = '14px'
        it.style.border = '1px solid #ccc'
        it.style.backgroundColor = '#fff'
      })

      groupedNutrients[group].forEach(n => {
        let amount = 0

        const amountBox = Span('0').with(it => {
          it.style.marginLeft = '18px'
        })

        const nutrientRow = Hbox().with(it => {
          it.style.padding = '6px 8px'
          it.append(
            Link(`?page=${Page.TopFoods}&nutrient-id=${n.id}`).with(it => {
              it.textContent = n.name + (n.alias ? ' / ' + n.alias : '')
            }),
            Spacer(),
            amountBox,
            ' ' + n.unit_abbr
          )

          return {
            getAmount() {
              return amount
            },
            setAmount(a: number) {
              amount = a
              amountBox.textContent = '' + amount.toFixed(1)
              const im = intakeMetadata.find(im => im.nutrient_id === n.id)
              if (im?.ul != null || im?.rdi != null) {
                if (im.ul != null && amount >= im.ul) {
                  it.style.backgroundImage = `linear-gradient(90deg, rgba(150, 0, 0, 0.15) 100%, transparent 0)`
                } else if (im.rdi != null && im.ul == null && pct(amount, im.rdi) > 100) {
                  it.style.backgroundImage = `linear-gradient(90deg, rgba(240, 240, 0, 0.15) 100%, transparent 0)`
                } else if (im.rdi != null && (im.ul != null || pct(amount, im.rdi) <= 100)) {
                  it.style.backgroundImage = `linear-gradient(90deg, rgba(0, 150, 0, 0.15) ${pct(amount, im.rdi)}%, transparent 0)`
                }
              }
            }
          }
        })

        nutrientRows[n.id] = nutrientRow
        groupContent.append(nutrientRow)
      })

      nutritionalOverview.append(
        Vbox().with(it => {
          it.style.float = 'left'
          it.style.marginRight = '-1px'

          it.append(
            ControlTitle(group).with(it => {
              it.style.margin = '0'
              it.style.padding = '6px'
              it.style.fontWeight = 'bold'
              it.style.textAlign = 'center'
              it.style.textTransform = 'uppercase'
              it.style.fontSize = '13px'
              it.style.color = '#333'
              it.style.borderTop = it.style.borderRight = it.style.borderLeft = '1px solid #ccc'
              it.style.backgroundColor = '#eee'
            }),
            groupContent
          )
        })
      )
    })
  })

  const foodAmounts: { [foodId: number]: number } = {}

  const foodFinderInput = FoodFinderInput().with(it => {
    it.onSelect = async food => {
      if (foodAmounts.hasOwnProperty(food.id)) {
        return
      }

      const foodDetails = await api('findFoodDetails', {
        id: food.id,
        nutrients: userNutrients.map(({ id }) => id)
      })

      function onFoodAmountChange(nextFoodAmount: number) {
        const priorFoodAmount = foodAmounts[food.id] || 0
        foodAmounts[food.id] = nextFoodAmount

        foodDetails.nutrients.forEach(n => {
          const nutrientAmountPerGram = (n.amount || 0) / 100
          const priorNutrientAmount = priorFoodAmount * nutrientAmountPerGram
          const nextNutrientAmount = nextFoodAmount * nutrientAmountPerGram
          const nutrientRow = nutrientRows[n.id]
          nutrientRow.setAmount(nutrientRow.getAmount() - priorNutrientAmount + nextNutrientAmount)
        })
      }

      mondayList.append(
        Html('li').with(li => {
          li.style.display = 'flex'
          li.style.marginTop = mondayList.children.length === 0 ? '0' : '-1px'
          li.style.fontSize = '14px'

          li.append(
            Span(food.name).with(it => {
              it.style.whiteSpace = 'nowrap'
              it.style.overflow = 'hidden'
              it.style.textOverflow = 'ellipsis'
              it.style.paddingTop = '3px'
              tooltip.attach(food.name, it)
            }),
            Spacer(),
            TextField().with(it => {
              it.type = 'number'
              it.min = '0'
              it.max = '9999'
              it.value = '100'
              it.oninput = () => onFoodAmountChange(parseFloat(it.value))
              it.onblur = () => {
                if (it.value === '0') {
                  li.remove()
                  onFoodAmountChange(0)
                  delete foodAmounts[food.id]
                }
              }
              onFoodAmountChange(100)
              it.style.marginLeft = '6px'
            })
          )
        })
      )
    }
  })

  const controlsRow = Hbox().with(it => {
    it.style.marginBottom = '12px'
    it.append(foodFinderInput)
  })

  const mondayList = List()

  const mondayCard = Card().with(it => {
    it.style.marginBottom = '12px'
    it.style.width = '400px'
    it.append(mondayList)
  })

  const nutritionalOverview = Html('div')

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(
      controlsRow,
      mondayCard,
      nutritionalOverview
    )
  })
}
