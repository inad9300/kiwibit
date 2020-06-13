import { Html } from '../components/Html'
import { LinkButton } from '../components/LinkButton'
import { Page } from '../pages'
import { Hbox } from '../components/Box'
import { Spacer } from '../components/Spacer'

export function HomePage() {
  return Html('div').with(it => {
    it.style.width = '600px'
    it.style.margin = '0 32px 20px 32px'
    it.style.lineHeight = '1.4'
    it.style.fontSize = '15px'
    it.style.color = '#333'

    it.innerHTML = `
      <h1>Meal Planning <span style="color: grey">and</span> Nutritional Tracking</h1>
      <p>En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.</p>
      <p>Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.</p>
      <p>El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.</p>
      <p>Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera.</p>
      <p>Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.</p>
      <p>Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana.</p>
      <p>Pero esto importa poco a nuestro cuento: basta que en la narración dél no se salga un punto de la verdad.</p>
    `

    it.append(
      LinedTitle('Explore foods').with(it => {
        it.style.marginBottom = '8px'
      }),
      Hbox().with(it => {
        it.setChildren([
          FoodButton('Blueberries', 1792),
          FoodButton('Dates', 2044),
          FoodButton('Cashews', 3257),
          FoodButton('Flaxseeds', 3329),
          FoodButton('Turmeric', 306)
        ], '8px')
      }),
      Hbox().with(it => {
        it.style.marginTop = '8px'
        it.setChildren([
          FoodButton('Parsley', 2665),
          FoodButton('Kale', 2604),
          FoodButton('Broccoli', 2493),
          FoodButton('Garlic', 2589),
          FoodButton('Lentils', 4418)
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
