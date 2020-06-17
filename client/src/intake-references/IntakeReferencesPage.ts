import { Html, Svg } from '../components/Html'
import { api, ApiOutput } from '../utils/api'
import { NutrientSelect } from '../top-foods/NutrientSelect'
import { Vbox } from '../components/Box'

export function IntakeReferencesPage() {
  const container = Html('div').with(it => {
    it.style.flex = '1'
  })

  return Vbox().with(it => {
    it.style.padding = '12px 16px 16px'
    it.append(
      NutrientSelect().with(it => {
        it.style.marginBottom = '12px'
        it.onchange = () => {
          api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
            container.innerHTML = ''
            container.append(Chart(data, container.getBoundingClientRect()))
          })
        }
        // TODO Remove...
        it.promise.then(() => {
          it.setSelected(24)
          api('getAllIntakeMetadataForNutrient', { nutrientId: it.getSelected()!.id }).then(data => {
            container.innerHTML = ''
            container.append(Chart(data, container.getBoundingClientRect()))
          })
        })
      }),
      container
    )
  })
}

function Chart(data: ApiOutput<'getAllIntakeMetadataForNutrient'>, container: DOMRect) {
  const allValues = [...data.rdis.map(rdi => rdi.value), ...data.uls.map(ul => ul.value)]
  const minYVal = Math.min(...allValues)
  const maxYVal = Math.max(...allValues)

  const allMaxAges = [...data.rdis.map(rdi => rdi.age_max), ...data.uls.map(ul => ul.age_max)]
  const minXVal = Math.min(...allMaxAges)
  const maxXVal = Math.max(...allMaxAges)

  const pixel = (x: number, y: number) => ({
    x: x * container.width / maxXVal,
    y: y * container.height / maxYVal
  })

  const yAxis = Svg('line').with(it => {
    it.y1.baseVal.value = 0
  })

  const xAxis = Svg('line').with(it => {
    it.x2.baseVal.value = container.width
  })

  yAxis.x1.baseVal.value = yAxis.x2.baseVal.value = xAxis.x1.baseVal.value = 0
  yAxis.y2.baseVal.value = xAxis.y1.baseVal.value = xAxis.y2.baseVal.value = container.height
  yAxis.style.stroke = xAxis.style.stroke = '#aaa'

  const yStep = Math.floor((maxYVal - minYVal) / 10)
  const xStep = Math.floor((maxXVal - minXVal) / 10)
  const yStepPx = pixel(0, yStep).y
  const xStepPx = pixel(xStep, 0).x

  const yLabels: SVGTextElement[] = []
  let nextYLabel = 0
  for (let i = container.height; i > 0; i -= yStepPx) {
    yLabels.push(
      SvgText('' + nextYLabel, 0, container.height - pixel(0, nextYLabel).y).with(it => {
        it.style.textAnchor = 'start' // TODO 'end'
        it.style.stroke = 'orange'
      })
    )
    nextYLabel += yStep
  }

  const xLabels: SVGTextElement[] = []
  let nextXLabel = 0
  for (let i = 0; i < container.width; i += xStepPx) {
    xLabels.push(
      SvgText('' + nextXLabel, pixel(nextXLabel, 0).x, container.height).with(it => {
        it.style.textAnchor = 'middle'
        it.style.stroke = 'green'
      })
    )
    nextXLabel += xStep
  }

  const rdiPoints: SVGElement[] = []
  data.rdis.forEach(rdi => {
    const x1 = pixel(rdi.age_min, 0).x
    const y1 = container.height - pixel(0, rdi.value).y
    const x2 = pixel(rdi.age_max, 0).x
    const y2 = y1
    const color = rdi.gender === 'M' ? 'lightblue' : 'pink'

    const priorPoint = rdiPoints.slice(-1)[0] as SVGCircleElement | undefined
    if (priorPoint) {
      rdiPoints.push(
        SvgLine(priorPoint.cx.baseVal.value, priorPoint.cy.baseVal.value, x1, y1).with(it => {
          it.style.stroke = priorPoint.style.fill
        })
      )
    }

    rdiPoints.push(
      SvgLine(x1, y1, x2, y2).with(it => { it.style.stroke = color }),
      SvgCircle(x1, y1, 3).with(it => { it.style.fill = color }),
      SvgCircle(x2, y2, 3).with(it => { it.style.fill = color })
    )
  })

  const ulPoints: SVGElement[] = []
  data.uls.forEach(ul => {
    const x1 = pixel(ul.age_min, 0).x
    const y1 = container.height - pixel(0, ul.value).y
    const x2 = pixel(ul.age_max, 0).x
    const y2 = y1
    const color = ul.gender === 'M' ? 'blue' : 'purple'

    const priorPoint = ulPoints.slice(-1)[0] as SVGCircleElement | undefined
    if (priorPoint) {
      ulPoints.push(
        SvgLine(priorPoint.cx.baseVal.value, priorPoint.cy.baseVal.value, x1, y1).with(it => {
          it.style.stroke = priorPoint.style.fill
        })
      )
    }

    ulPoints.push(
      SvgLine(x1, y1, x2, y2).with(it => { it.style.stroke = color }),
      SvgCircle(x1, y1, 3).with(it => { it.style.fill = color }),
      SvgCircle(x2, y2, 3).with(it => { it.style.fill = color })
    )
  })

  return Svg('svg').with(it => {
    it.style.width = it.style.height = '100%'
    it.append(yAxis, xAxis, ...yLabels, ...xLabels, ...rdiPoints, ...ulPoints)
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

function SvgCircle(cx: number, cy: number, r: number) {
  return Svg('circle').with(it => {
    it.cx.baseVal.value = cx
    it.cy.baseVal.value = cy
    it.setAttributeNS(null, 'r', '' + r)
  })
}
