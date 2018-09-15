import {h} from '@soil/dom'
import * as Highcharts from 'highcharts'
import {get} from '../shared/http/get'
import {title} from '../shared/dom/title'
import * as api from '../../../shared/api'
import {serverUrl} from '../shared/constants'
import {nutrientSelect} from './nutrientSelect'
import {getUrlParams} from '../shared/utils/getUrlParams'

const urlParams = getUrlParams()
const urlPer = urlParams.get('per') || 'gram'

function reload(nutrientId: string, per: 'gram' | 'calory') {
    location.href = `/top-foods/index.html?nutrient-id=${nutrientId}&per=${per}`
}

const $nutrientSelect = nutrientSelect({
    onChange: nutrientId => reload(nutrientId, $perParamSelect.value as 'gram' | 'calory'),
    onLoad: nutrient => {
        showTopFoods(nutrient.Nutr_No, $perParamSelect.value as 'gram' | 'calory')
        $nutrientSelect.focus()
        title(`Top foods high in ${nutrient.display_name || nutrient.NutrDesc}`)
    }
})

const $perParamSelect = h.select({
    className: 's1',
    onchange: () => reload($nutrientSelect.value, $perParamSelect.value as 'gram' | 'calory')
}, [
    h.option({value: 'gram'}, ['Per 100 grams']),
    h.option({value: 'calory'}, ['Per 100 calories'])
])

// TODO $nutrientSelect.value = ''
$perParamSelect.value = urlPer

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
        pointFormat: `<b>{point.Nutr_Val:.2f}\u2009{point.Units}</b> / {point.Long_Desc} ({point.FdGrp_Desc})`
    },
    credits: {enabled: false},
    legend: {enabled: false},
    plotOptions: {
        series: {
            cursor: 'pointer',
            point: {
                events: {
                    click: function (event: MouseEvent) {
                        const url = '/food-details/index.html?id=' + (this as api.TopFood).NDB_No
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
    h.form({className: 'spaced h box'}, [
        Object.assign($nutrientSelect, {className: 's3'}),
        $perParamSelect
    ]),
    h.div({className: 'outer-chart-wrapper s1'}, [
        $chartWrapper
    ])
]))

function showTopFoods(nutrientId: string, per: 'gram' | 'calory') {
    get<api.TopFood[]>(`${serverUrl}/nutrients/${nutrientId}/foods?per=${per}`).then(topFoods => {
        $chartWrapper.classList.remove('hidden')

        const data = topFoods.map(f => ({
            ...f,
            name: f.Long_Desc,
            y: f.Nutr_Val,
            color: f.color
        }))

        $chart.series[0].setData(data)
        $chart.reflow()

        get<api.Rdi[]>(`${serverUrl}/rdis?age=20&gender=M`).then(rdis => {
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
