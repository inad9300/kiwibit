import { Svg } from './Html'

export function SvgText(text: string, x: number, y: number) {
  return Svg('text').with(it => {
    it.textContent = text
    it.setAttributeNS(null, 'x', '' + x)
    it.setAttributeNS(null, 'y', '' + y)
  })
}
