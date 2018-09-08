import {h} from '@soil/dom'
import * as Highcharts from 'highcharts'
import {get} from '../shared/http/get'
import {title} from '../shared/dom/title'
import {serverUrl} from '../shared/constants'
import {TopFood, Rdi} from '../../../shared/contract'
import {nutrientSelect} from './nutrientSelect'

const $nutrientSelect = nutrientSelect({
    onChange: nutrientId => location.href = '/top-foods/index.html?nutrient-id=' + nutrientId,
    onLoad: nutrient => {
        showTopFoods(nutrient.Nutr_No)
        $nutrientSelect.focus()
        title(`Top foods high in ${nutrient.display_name || nutrient.NutrDesc}`)
    }
})

const $chartWrapper = h.div({className: 'chart-wrapper hidden'})

const $chart = Highcharts.chart($chartWrapper, {
    chart: {type: 'bar'},
    title: {text: null},
    xAxis: {
        type: 'category',
        labels: {
            style: {color: '#333', fontSize: '13px'}
        }
    },
    yAxis: {title: {text: null}},
    tooltip: {
        headerFormat: '',
        pointFormat: `<b>{point.Nutr_Val}\u2009{point.Units}</b> / {point.Long_Desc} ({point.FdGrp_Desc})`
    },
    credits: {enabled: false},
    legend: {enabled: false},
    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function (event: MouseEvent) {
                        const url = '/food-details/index.html?id=' + (this as TopFood).NDB_No
                        if (event.ctrlKey) {
                            window.open(url, '_blank')
                        } else {
                            location.href = url
                        }
                        return true
                    }
                }
            }
        }
    },
    series: [{}]
})

document.body.appendChild(h.div({className: 'top-foods v box'}, [
    $nutrientSelect,
    h.div({className: 'outer-chart-wrapper s1'}, [
        $chartWrapper
    ])
]))

function showTopFoods(nutrientId: string) {
    get<TopFood[]>(`${serverUrl}/nutrients/${nutrientId}/foods`).then(topFoods => {
        $chartWrapper.classList.remove('hidden')

        const data = topFoods.map(f => ({
            ...f,
            name: f.Long_Desc,
            y: f.Nutr_Val,
            color: f.color
        }))

        $chart.series[0].setData(data)
        $chart.reflow()

        get<Rdi[]>(`${serverUrl}/rdis?age=20&gender=M`).then(rdis => {
            const rdi = rdis.find(r => r.Nutr_No === nutrientId)
            if (!rdi) {
                return
            }
            const plotLines = [plotLine('<abbr title="Reference Daily Intake">RDI</abbr>', rdi.value, 'green')]
            if (rdi.max) {
                plotLines.push(plotLine('<abbr title="Tolerable Upper Intake Level">UL</abbr>', rdi.max, 'red'))
            }
            $chart.yAxis[0].update({
                max: Math.max(rdi.value, ...topFoods.map(f => f.Nutr_Val)),
                plotLines
            })
        })
    })
}

function plotLine(text: string, value: number, color: string) {
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
            style: {color, fontSize: '9px'},
            useHTML: true
        }
    }
}
