import { Html, Svg } from '../components/Html'
import { api, ApiOutput } from '../utils/api'
import { NutrientSelect } from '../top-foods/NutrientSelect'
import { Vbox, Hbox } from '../components/Box'
import { Italics } from '../components/Italics'
import { SvgLine } from '../components/SvgLine'
import { SvgText } from '../components/SvgText'
import { SvgCircle } from '../components/SvgCircle'
import { tooltip } from '../main'
import { toInt } from '../utils/toInt'

type Point = {
  x: number
  y: number
}

export function IntakeReferencesPage() {
  const nutrientSelect = NutrientSelect().with(it => {
    it.style.marginBottom = '12px'
    it.onchange = () => {
      api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
        lastData = data
        drawLastData()
      })
    }
  })

  const container = Html('div').with(it => {
    it.style.flex = '1'
    it.style.position = 'relative'
  })

  let lastData: ApiOutput<'getAllIntakeMetadataForNutrient'>

  function drawLastData() {
    if (lastData) {
      container.innerHTML = ''
      container.style.backgroundColor = '#fff'
      if (lastData.rdis.length > 0 || lastData.uls.length > 0) {
        container.append(LineChart(lastData, container.getBoundingClientRect()))
      } else {
        container.style.backgroundColor = '#f5f5f5'
        container.append(
          Italics(`No RDI nor UL data found for ${nutrientSelect.getSelected()?.name}.`).with(it => {
            it.style.display = 'inline-block'
            it.style.width = '100%'
            it.style.position = 'absolute'
            it.style.top = '50%'
            it.style.transform = 'translateY(-50%)'
            it.style.textAlign = 'center'
            it.style.fontSize = '15px'
            it.style.color = '#555'
          })
        )
      }
    }
  }

  window.addEventListener('resize', () => drawLastData())

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(
      Hbox().with(it => {
        it.append(nutrientSelect)
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

  function pointsToLine(points: Point[], color: string) {
    if (points.length < 2) return []

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

  function pointsToCircles(points: Point[], color: string, prop: 'UL' | 'RDI', sex: 'males' | 'females') {
    return points.map(({ x, y }) => {
      return SvgCircle(xPixelPos(x), yPixelPos(y), 8).with(it => {
        it.style.fill = color
        it.style.opacity = '0'
        it.addEventListener('mouseenter', () => it.style.opacity = '0.7')
        it.addEventListener('mouseleave', () => it.style.opacity = '0')

        let finalSex = sex
        if (sex === 'males') {
          const targetArr = prop === 'RDI' ? femaleRdiValues : femaleUlValues
          if (targetArr.find(p => p.x === x && p.y === y)) {
            finalSex += ' and females'
          }
        }

        tooltip.attach(`${prop} for ${x}-year-old ${finalSex}: ${y} ${data.unit_abbr}`, it)
      })
    })
  }

  return Svg('svg').with(it => {
    it.style.width = it.style.height = '100%'
    it.append(
      yAxis,
      xAxis,
      ...yLabels,
      ...xLabels,
      ...pointsToLine(femaleRdiValues, '#ff9fb0'),
      ...pointsToLine(maleRdiValues, '#9cd6e8'),
      ...pointsToLine(femaleUlValues, '#ff607d'),
      ...pointsToLine(maleUlValues, '#56a7c1'),
      ...pointsToCircles(femaleRdiValues, '#ff9fb0', 'RDI', 'females'),
      ...pointsToCircles(maleRdiValues, '#9cd6e8', 'RDI', 'males'),
      ...pointsToCircles(femaleUlValues, '#ff607d', 'UL', 'females'),
      ...pointsToCircles(maleUlValues, '#56a7c1', 'UL', 'males'),
    )
  })
}
