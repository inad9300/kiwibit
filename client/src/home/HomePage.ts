import { Html } from '../components/Html'

function P(text: string) {
  return Html('p').with(it => {
    it.textContent = text
  })
}

export function HomePage() {
  return Html('div').with(it => {
    it.style.width = '600px'
    it.style.margin = '8px 32px'
    it.style.lineHeight = '1.4'
    it.style.fontSize = '15px'
    it.style.color = '#333'

    it.append(
      P(`En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.`),
      P(`Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.`),
      P(`El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino.`),
      P(`Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera.`),
      P(`Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza.`),
      P(`Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana.`),
      P(`Pero esto importa poco a nuestro cuento: basta que en la narración dél no se salga un punto de la verdad.`),
    )
  })
}
