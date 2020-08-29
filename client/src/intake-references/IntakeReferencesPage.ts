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
import { getUrlParams } from '../utils/getUrlParams'
import { updateUrl } from '../utils/updateUrl'
import { Page } from '../pages'
import { fetchSettings } from '../settings/SettingsApi'

function urlNutrientId() {
  const idStr = getUrlParams().get('nutrient-id')
  return idStr ? toInt(idStr) : ''
}

type Point = {
  x: number
  y: number
}

export function IntakeReferencesPage() {
  const nutrientSelect = NutrientSelect().with(it => {
    it.style.marginBottom = '12px'
    it.onchange = () => {
      const nutrientId = nutrientSelect.getSelected()?.id || ''
      if (urlNutrientId() !== nutrientId) {
        updateUrl(Page.IntakeReferences, { 'nutrient-id': nutrientId })
      }
      loadAndDrawData(it.getSelected()!.id)
    }
  })

  const container = Html('div').with(it => {
    it.style.flex = '1'
    it.style.position = 'relative'
  })

  let lastData: ApiOutput<'getAllIntakeMetadataForNutrient'>

  function loadAndDrawData(nutrientId: number) {
    api('getAllIntakeMetadataForNutrient', { nutrientId }, { cache: true }).then(data => {
      lastData = data
      drawLastData()
    })
  }

  async function drawLastData() {
    if (lastData) {
      container.innerHTML = ''
      container.style.backgroundColor = '#fff'

      if (lastData.rdis.length > 0 || lastData.uls.length > 0) {
        const { sex } = await fetchSettings()
        const chart = LineChart(lastData, container.getBoundingClientRect(), sex)
        container.append(chart)

        const chartRect = chart.getBoundingClientRect()
        chart.yLabels.filter(l => l.getBoundingClientRect().top < chartRect.top).forEach(l => l.remove())
        chart.xLabels.filter(l => l.getBoundingClientRect().right > chartRect.right).forEach(l => l.remove())
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

  function loadFromUrl() {
    const nutrientId = urlNutrientId()
    if (nutrientId) {
      nutrientSelect.setSelected(nutrientId)
      loadAndDrawData(nutrientId)
    } else {
      container.innerHTML = ''
      nutrientSelect.setSelected('')
    }
  }

  nutrientSelect.promise.then(() => loadFromUrl())
  window.addEventListener('popstate', () => loadFromUrl())

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

function LineChart(data: ApiOutput<'getAllIntakeMetadataForNutrient'>, container: DOMRect, sex: 'M' | 'F') {
  const allValues = [...data.rdis.map(rdi => rdi.value), ...data.uls.map(ul => ul.value)]
  const maxYVal = Math.max(...allValues)

  const allMaxAges = [...data.rdis.map(rdi => rdi.age_max), ...data.uls.map(ul => ul.age_max)]
  const maxXVal = Math.min(85, Math.max(...allMaxAges))

  const lengthOfLongestYVal = Math.max(...allValues.map(v => ('' + v).length))
  const maxNumOfYValDecimals = Math.max(...allValues.map(v => ('' + v).split('.')[1]?.length || 0))

  const leftMarginPx = 8 + 8 * lengthOfLongestYVal
  const bottomMarginPx = 18

  const xPixel = (x: number) => (x * container.width / maxXVal) + leftMarginPx
  const yPixel = (y: number) => container.height - bottomMarginPx - (y * (container.height - bottomMarginPx) / maxYVal)

  const yAxis = Svg('line').with(it => {
    it.y1.baseVal.value = 0
  })

  const xAxis = Svg('line').with(it => {
    it.x2.baseVal.value = container.width
  })

  yAxis.x1.baseVal.value = yAxis.x2.baseVal.value = xAxis.x1.baseVal.value = leftMarginPx
  yAxis.y2.baseVal.value = xAxis.y1.baseVal.value = xAxis.y2.baseVal.value = container.height - bottomMarginPx

  yAxis.style.stroke = xAxis.style.stroke = '#aaa'

  const numOfYLabels = Math.ceil((container.height - bottomMarginPx) / 50)
  const numOfXLabels = Math.ceil((container.width - leftMarginPx) / 50)

  const yStep = maxNumOfYValDecimals === 0 ? Math.ceil(maxYVal / numOfYLabels) : maxYVal / numOfYLabels
  const xStep = Math.ceil(maxXVal / numOfXLabels)

  const yLabels: SVGTextElement[] = []
  for (let i = 0; i < numOfYLabels + 1; ++i) {
    const value = i * yStep
    yLabels.push(
      SvgText(value.toFixed(maxNumOfYValDecimals), leftMarginPx - 8, yPixel(value) + 3).with(it => {
        it.style.textAnchor = 'end'
        it.style.fill = '#333'
        it.style.fontSize = '13px'
      })
    )
  }

  const xLabels: SVGTextElement[] = []
  for (let i = 0; i < numOfXLabels + 1; ++i) {
    const value = i * xStep
    xLabels.push(
      SvgText('' + value, xPixel(value), container.height).with(it => {
        it.style.textAnchor = 'middle'
        it.style.fill = '#333'
        it.style.fontSize = '13px'
      })
    )
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
        xPixel(priorPoint.x), yPixel(priorPoint.y),
        Math.min(container.width, xPixel(point.x)), yPixel(point.y)
      ).with(it => {
        it.style.stroke = color
        it.style.strokeWidth = '2'
      })
    })
  }

  function pointsToCircles(points: Point[], color: string, prop: 'UL' | 'RDI', sex: 'males' | 'females') {
    return points.map(({ x, y }) => {
      return SvgCircle(xPixel(x), yPixel(y), 8).with(it => {
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

  const linesAndCircles = [
    pointsToLine(femaleRdiValues, '#ff9fb0'),
    pointsToLine(maleRdiValues, '#9cd6e8'),
    pointsToLine(femaleUlValues, '#ff607d'),
    pointsToLine(maleUlValues, '#56a7c1'),
    pointsToCircles(femaleRdiValues, '#ff9fb0', 'RDI', 'females'),
    pointsToCircles(maleRdiValues, '#9cd6e8', 'RDI', 'males'),
    pointsToCircles(femaleUlValues, '#ff607d', 'UL', 'females'),
    pointsToCircles(maleUlValues, '#56a7c1', 'UL', 'males'),
  ]

  if (sex === 'F') {
    for (let i = 0; i < linesAndCircles.length; i += 2) {
      [linesAndCircles[i], linesAndCircles[i + 1]] = [linesAndCircles[i + 1], linesAndCircles[i]]
    }
  }

  return Svg('svg').with(it => {
    it.style.width = it.style.height = '100%'
    it.style.overflow = 'visible'
    it.append(
      yAxis,
      xAxis,
      ...yLabels,
      ...xLabels,
      ...([] as SVGElement[]).concat.apply([], linesAndCircles)
    )

    return { yLabels, xLabels }
  })
}
