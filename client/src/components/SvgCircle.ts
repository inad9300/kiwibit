import { Svg } from './Html'

export function SvgCircle(cx: number, cy: number, r: number) {
  return Svg('circle').with(it => {
    it.cx.baseVal.value = cx
    it.cy.baseVal.value = cy
    it.setAttributeNS(null, 'r', '' + r)
  })
}
