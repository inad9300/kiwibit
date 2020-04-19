import * as Highcharts from 'highcharts'
import { Page } from '../pages'

export function topFoodsChart() {
  const root = document.createElement('div')

  const chart = Highcharts.chart(root, {
    chart: { type: 'bar' },
    title: { text: undefined },
    xAxis: {
      type: 'category',
      title: { text: null },
      labels: {
        style: { color: '#333', fontSize: '13px' }
      }
    },
    yAxis: { title: { text: null } },
    tooltip: {
      headerFormat: '',
      pointFormatter: function () {
        const { originalData } = this as any
        return `
          <b>${this.y} ${originalData.unit_abbr}</b>
          (${originalData.usda_category_name})
        `
      }
    },
    credits: { enabled: false },
    legend: { enabled: false },
    plotOptions: {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: evt => {
              const foodId = (evt.point as any).originalData.id
              location.href = `/?page=${Page.FoodFinder}&food-id=${foodId}`
            }
          }
        }
      }
    },
    series: [{ type: 'bar' }]
  })

  return Object.assign(root, {
    setData(intakeMetadata: any, topFoods: any[]) {
      root.style.height = topFoods.length * 20 + 'px'

      const data = topFoods.map(f => ({
        originalData: f,
        name: f.name,
        y: f.amount,
        color: f.color
      }))

      chart.series[0].setData(data)

      chart.yAxis[0].update({
        max: Math.max(
          intakeMetadata.rdi ?? 0,
          intakeMetadata.ul ?? 0,
          ...topFoods.map(f => f.amount)
        ),
        plotLines: [
          plotLine(
            intakeMetadata.rdi,
            'green',
            `<abbr title="Reference Daily Intake (${intakeMetadata.rdi})">RDI</abbr>`
          ),
          plotLine(
            intakeMetadata.ul,
            'red',
            `<abbr title="Tolerable Upper Intake Level (${intakeMetadata.ul}, daily)">UL</abbr>`
          )
        ]
      })

      chart.reflow()
    }
  })
}

function plotLine(value: number, color: string, text: string) {
  return {
    value,
    width: 1,
    zIndex: 10,
    color,
    label: {
      text,
      rotation: 0,
      y: -1,
      x: -8,
      style: { color, fontSize: '9px' },
      useHTML: true
    }
  }
}
