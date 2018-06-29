import './top-foods.scss'

import {h} from '@soil/dom'
import * as Highcharts from 'highcharts'
import {get} from './common/get'
import {header} from './common/header'

interface Nutrient {
    nutr_no: string
    units: string
    nutrdesc: string
}

interface TopFood {
    long_desc: string
    nutr_val: number
    fdgrp_cd: string
    fdgrp_desc: string
}

const FOOD_CATEGORY_COLOR: {[categoryId: string]: string} = {
    '0200': '#8baa27', // Spices and herbs.
    '0400': '#1f79c6', // Fats and oils.
    '0600': '#c61f1f', // Soupes and sauces.
    '0800': '#a74f0f', // Breakfast cereals.
    '0900': '#e69809', // Fruits and juices.
    '1100': '#227e10', // Vegetables.
    '1200': '#c5643f', // Nuts and seeds.
    '1400': '#3fc5b7', // Beverages.
    '1600': '#c53f94', // Legumes.
    '2000': '#ebef4e' // Grains.
}

const nutrientSelect = h.select({
    onchange: () => showTopFoods(nutrientSelect.value),
    style: {
        alignSelf: 'flex-start',
        marginBottom: '10px'
    }
}, [
    h.option({disabled: true, selected: true}, ['Nutrient'])
])

const chartWrapper = h.div({
    style: {
        flex: '1',
        display: 'none'
    }
})

const chart = Highcharts.chart(chartWrapper, {
    chart: {type: 'column'},
    title: {text: ''},
    xAxis: {type: 'category'},
    yAxis: {title: {text: ''}},
    tooltip: {
        headerFormat: '',
        pointFormat: `<b>{point.y}</b> / {point.name} ({point.foodCategory})`
    },
    credits: {enabled: false},
    legend: {enabled: false},
    series: [{}]
})

get('/nutrients', {cache: true})
    .then((nutrients: Nutrient[]) => {
        nutrients
            .map(n => h.option({value: n.nutr_no}, [`${n.nutrdesc} (${n.units})`]))
            .forEach(opt => nutrientSelect.appendChild(opt))
    })

function showTopFoods(nutrientId: string) {
    get(`/nutrients/${nutrientId}/foods`, {cache: true})
        .then((topFoods: TopFood[]) => {
            const data = topFoods
                .reverse()
                .map(f => ({
                    name: f.long_desc,
                    y: f.nutr_val,
                    foodCategory: f.fdgrp_desc,
                    color: FOOD_CATEGORY_COLOR[f.fdgrp_cd]
                }))

            chartWrapper.style.display = ''
            chart.series[0].setData(data)
            chart.reflow()
        })
}

document.body.appendChild(header())
document.body.appendChild(h.div({
    className: 'padded',
    style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: '1'
    }
}, [
    nutrientSelect,
    chartWrapper
]))

nutrientSelect.focus()
