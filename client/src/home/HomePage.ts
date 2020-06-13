import { Html } from '../components/Html'
import { LinkButton } from '../components/LinkButton'
import { Page } from '../pages'
import { Hbox } from '../components/Box'
import { Spacer } from '../components/Spacer'
import { Span } from '../components/Span'

export function HomePage() {
  return Html('div').with(it => {
    it.style.width = '600px'
    it.style.margin = '0 32px 20px 32px'
    it.style.lineHeight = '1.4'
    it.style.fontSize = '15px'
    it.style.color = '#333'

    it.append(
      Html('h1').with(it => {
        it.append(
          'Meal Planning',
          Span(' and ').with(it => {
            it.style.color = 'grey'
          }),
          'Nutritional Tracking'
        )
      }),
      LinedTitle('Explore foods').with(it => {
        it.style.marginBottom = '8px'
      }),
      Hbox().with(it => {
        it.setChildren([
          FoodButton('Blueberries', 1792),
          FoodButton('Flaxseeds', 3329),
          FoodButton('Turmeric', 306),
          FoodButton('Broccoli', 2493),
          FoodButton('Mushrooms', 2631),
        ], '8px')
      }),
      Hbox().with(it => {
        it.style.marginTop = '8px'
        it.setChildren([
          FoodButton('Dates', 2044),
          FoodButton('Cashews', 3257),
          FoodButton('Parsley', 2665),
          FoodButton('Kale', 2604),
          FoodButton('Lentils', 4418),
          FoodButton('Garlic', 2589),
        ], '8px')
      })
    )
  })
}

function LinedTitle(text: string) {
  const Line = () => Spacer().with(it => {
    it.style.borderTop = '1px solid lightgrey'
    it.style.marginTop = '11px'
  })

  return Hbox().with(it => {
    it.setChildren([
      Line(),
      Html('h3').with(it => {
        it.textContent = text
        it.style.fontSize = '15px'
        it.style.margin = '0'
        it.style.fontWeight = 'normal'
        it.style.color = '#999'
      }),
      Line()
    ], '8px')
  })
}

function FoodButton(name: string, id: number) {
  return LinkButton(name, `?page=${Page.FoodFinder}&food-id=${id}`).with(it => {
    it.style.flex = '1'
    it.style.textAlign = 'center'
  })
}
