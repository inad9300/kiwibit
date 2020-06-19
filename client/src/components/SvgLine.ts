import { Svg } from './Html'

export function SvgLine(x1: number, y1: number, x2: number, y2: number) {
  return Svg('line').with(it => {
    it.x1.baseVal.value = x1
    it.y1.baseVal.value = y1
    it.x2.baseVal.value = x2
    it.y2.baseVal.value = y2
  })
}
