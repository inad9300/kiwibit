import { Html, Svg } from '../components/Html'
import { api, ApiOutput } from '../utils/api'
import { NutrientSelect } from '../top-foods/NutrientSelect'
import { Vbox, Hbox } from '../components/Box'
import { toInt } from '../utils/toInt'

type Point = {
  x: number
  y: number
}

export function IntakeReferencesPage() {
  const container = Html('div').with(it => {
    it.style.flex = '1'
  })

  let lastData: ApiOutput<'getAllIntakeMetadataForNutrient'>

  window.addEventListener('resize', () => {
    if (lastData) {
      container.innerHTML = ''
      container.append(LineChart(lastData, container.getBoundingClientRect()))
    }
  })

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(
      Hbox().with(it => {
        it.append(
          NutrientSelect().with(it => {
            it.style.marginBottom = '12px'
            it.onchange = () => {
              api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
                lastData = data
                container.innerHTML = ''
                container.append(LineChart(data, container.getBoundingClientRect()))
              })
            }
            // TODO Remove...
            it.promise.then(() => {
              it.setSelected(24)
              api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
                lastData = data
                container.innerHTML = ''
                container.append(LineChart(data, container.getBoundingClientRect()))
              })
            })
          })
        )
      }),
      container
    )
  })
}

function LineChart(data: ApiOutput<'getAllIntakeMetadataForNutrient'>, container: DOMRect) {
  const allValues = [...data.rdis.map(rdi => rdi.value), ...data.uls.map(ul => ul.value)]
  const minYVal = Math.min(...allValues)
  const maxYVal = Math.floor(Math.max(...allValues) * 1.05)

  const allMaxAges = [...data.rdis.map(rdi => rdi.age_max), ...data.uls.map(ul => ul.age_max)]
  const maxXVal = Math.min(85, Math.max(...allMaxAges))

  const leftMargin = 8 + 8 * (maxYVal + '').length
  const bottomMargin = 18

  const xPixels = (x: number) => x * container.width / maxXVal
  const yPixels = (y: number) => (container.height - (y * container.height / maxYVal))
  const xPixelPos = (x: number) => (x * container.width / maxXVal) + leftMargin
  const yPixelPos = (y: number) => (container.height - bottomMargin - (y * container.height / maxYVal))

  const yAxis = Svg('line').with(it => {
    it.y1.baseVal.value = 0
  })

  const xAxis = Svg('line').with(it => {
    it.x2.baseVal.value = container.width
  })

  yAxis.x1.baseVal.value = yAxis.x2.baseVal.value = xAxis.x1.baseVal.value = leftMargin
  yAxis.y2.baseVal.value = xAxis.y1.baseVal.value = xAxis.y2.baseVal.value = container.height - bottomMargin

  yAxis.style.stroke = xAxis.style.stroke = '#aaa'

  const labelFontSize = 13
  const spaceBtwYLabels = 80
  const vShiftYLabels = 4

  const rounder = toInt('1' + '0'.repeat(Math.max(0, (maxYVal + '').length - 2)))
  const yStep = toInt('' + ((maxYVal - minYVal) / (container.height / spaceBtwYLabels)) / rounder) * rounder
  const xStep = 5
  const yStepPx = yPixels(maxYVal - yStep)
  const xStepPx = xPixels(xStep)

  const yLabels: SVGTextElement[] = []
  let nextYLabel = 0
  for (let i = container.height; i > 0; i -= yStepPx) {
    yLabels.push(
      SvgText('' + nextYLabel, leftMargin - 8, yPixels(nextYLabel) - bottomMargin + vShiftYLabels).with(it => {
        it.style.textAnchor = 'end'
        it.style.fill = '#333'
        it.style.fontSize = labelFontSize + 'px'
      })
    )
    nextYLabel += yStep
  }

  const xLabels: SVGTextElement[] = []
  let nextXLabel = 0
  for (let i = 0; i < container.width; i += xStepPx) {
    xLabels.push(
      SvgText('' + nextXLabel, xPixels(nextXLabel) + leftMargin, container.height).with(it => {
        it.style.textAnchor = 'middle'
        it.style.fill = '#333'
        it.style.fontSize = labelFontSize + 'px'
      })
    )
    nextXLabel += xStep
  }

  function pointsToLine(points: Point[], color: string) {
    return points.slice(1).map((point, i) => {
      const priorPoint = points[i]
      return SvgLine(
        xPixelPos(priorPoint.x), yPixelPos(priorPoint.y),
        xPixelPos(point.x), yPixelPos(point.y)
      ).with(it => {
        it.style.stroke = color
        it.style.strokeWidth = '2'
      })
    })
  }

  const femaleRdiValues: Point[] = []
  const maleRdiValues: Point[] = []
  const femaleUlValues: Point[] = []
  const maleUlValues: Point[] = []

  for (const rdi of data.rdis) {
    const target = rdi.gender === 'F' ? femaleRdiValues : maleRdiValues
    target.push({ x: rdi.age_min, y: rdi.value }, { x: rdi.age_max, y: rdi.value })
  }

  for (const ul of data.uls) {
    const target = ul.gender === 'F' ? femaleUlValues : maleUlValues
    target.push({ x: ul.age_min, y: ul.value }, { x: ul.age_max, y: ul.value })
  }

  return Svg('svg').with(it => {
    it.style.width = it.style.height = '100%'
    it.append(
      yAxis,
      xAxis,
      ...yLabels,
      ...xLabels,
      ...pointsToLine(maleRdiValues, 'lightblue'),
      ...pointsToLine(femaleRdiValues, 'pink'),
      ...pointsToLine(maleUlValues, 'steelblue'),
      ...pointsToLine(femaleUlValues, 'mediumpurple')
    )
  })
}

function SvgLine(x1: number, y1: number, x2: number, y2: number) {
  return Svg('line').with(it => {
    it.x1.baseVal.value = x1
    it.y1.baseVal.value = y1
    it.x2.baseVal.value = x2
    it.y2.baseVal.value = y2
  })
}

function SvgText(text: string, x: number, y: number) {
  return Svg('text').with(it => {
    it.textContent = text
    it.setAttributeNS(null, 'x', '' + x)
    it.setAttributeNS(null, 'y', '' + y)
  })
}

// function SvgCircle(cx: number, cy: number, r: number) {
//   return Svg('circle').with(it => {
//     it.cx.baseVal.value = cx
//     it.cy.baseVal.value = cy
//     it.setAttributeNS(null, 'r', '' + r)
//   })
// }
