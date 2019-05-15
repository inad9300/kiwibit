import {h} from '@soil/dom'
import * as Highcharts from 'highcharts'
import {get} from '../shared/get'
import {title} from '../shared/dom/title'
import * as api from '../../../shared/api'
import {serverUrl} from '../shared/constants'
import {nutrientSelect} from './nutrientSelect'
import {getUrlParams} from '../shared/utils/getUrlParams'

const urlParams = getUrlParams()
const urlUnit = urlParams.get('unit') || 'gram'

function reload(nutrientId: string, unit: api.NutrientReferenceUnit) {
    location.href = `/top-foods/index.html?nutrient-id=${nutrientId}&unit=${unit}`
}

const $nutrientSelect = nutrientSelect({
    onChange: nutrientId => reload(nutrientId, $unitParamSelect.value as api.NutrientReferenceUnit),
    onLoad: nutrient => {
        showTopFoods(nutrient.Nutr_No, $unitParamSelect.value as api.NutrientReferenceUnit)
        $nutrientSelect.focus()
        title(`Top foods high in ${nutrient.display_name || nutrient.NutrDesc}`)
    }
})

const $unitParamSelect = h.select({
    className: 's1',
    onchange: () => reload($nutrientSelect.value, $unitParamSelect.value as api.NutrientReferenceUnit)
}, [
    h.option({value: 'gram'}, ['Per 100 grams']),
    h.option({value: 'calory'}, ['Per 100 calories'])
])

// TODO $nutrientSelect.value = ''
$unitParamSelect.value = urlUnit

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
        $unitParamSelect
    ]),
    h.div({className: 'outer-chart-wrapper s1'}, [
        $chartWrapper
    ])
]))

function showTopFoods(nutrientId: string, unit: api.NutrientReferenceUnit) {
    get<api.TopFood[]>(`${serverUrl}/nutrients/${nutrientId}/foods?unit=${unit}`).then(topFoods => {
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
