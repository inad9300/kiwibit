import { pad } from './pad'

export function avgRgb(hexColorA: string, hexColorB: string): string {
  const redA = parseInt(hexColorA.substr(1, 2), 16)
  const greenA = parseInt(hexColorA.substr(3, 2), 16)
  const blueA = parseInt(hexColorA.substr(5, 2), 16)

  const redB = parseInt(hexColorB.substr(1, 2), 16)
  const greenB = parseInt(hexColorB.substr(3, 2), 16)
  const blueB = parseInt(hexColorB.substr(5, 2), 16)

  return '#'
    + pad(Math.round((redA + redB) / 2).toString(16))
    + pad(Math.round((greenA + greenB) / 2).toString(16))
    + pad(Math.round((blueA + blueB) / 2).toString(16))
}
