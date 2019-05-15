import {h} from '@soil/dom'
import * as api from '../../../shared/api'
import {get} from '../shared/get'
import {add} from '../shared/utils/add'
import {pct} from '../shared/utils/pct'
import {getUrlParams} from '../shared/utils/getUrlParams'
import {title} from '../shared/dom/title'
import {icon} from '../shared/dom/icon'
import {clear} from '../shared/dom/clear'
import {serverUrl, nbsp} from '../shared/constants'
import {findFoodsModal} from './findFoodsModal'
import {foodGroupCircle} from './foodGroupCircle'

type ExtendedRdi = api.Rdi & api.FoodDetails['nutrients'][0] & {pct: number}

const $findFoodsModal = findFoodsModal()
document.body.appendChild($findFoodsModal)

const urlParams = getUrlParams()
const foodId = urlParams.get('id')
if (!foodId) {
    renderNoFoodScreen()
    throw new Error('Food id missing in the URL.')
}

Promise.all([
    get<api.Rdi[]>(`${serverUrl}/rdis?age=20&gender=M`),
    get<api.FoodDetails>(`${serverUrl}/foods/${foodId}`)
])
.then(([rdis, foodDetails]) => {
    title(foodDetails.Long_Desc)

    const extendedRdis = rdis
        .map(rdi => {
            const nutr = foodDetails.nutrients.find(nutr => nutr.NutrDesc === rdi.NutrDesc)
            return !nutr ? undefined : {
                ...rdi,
                ...nutr,
                pct: pct(nutr.Nutr_Val, rdi.value)
            }
        })
        .filter(pct => pct !== undefined) as ExtendedRdi[]

    const overallPct = pct(
        extendedRdis.map(rdi => Math.min(rdi.pct, 100)).reduce(add, 0),
        100 * extendedRdis.length
    )

    const $sortByNameBtn = h.a({
        title: 'Sort nutrients alphabetically',
        onclick: () => renderNutrientsSortedByName()
    }, [icon('sort-alpha-down')])

    const $sortByPctBtn = h.a({
        title: 'Sort nutrients by RDI coverage',
        onclick: () => renderNutrientsSortedByPct()
    }, [icon('sort-amount-down')])

    const $nutrientList = h.ul({})

    if ((localStorage.getItem('nutrients_order') || 'alpha') === 'alpha') {
        renderNutrientsSortedByName()
    } else {
        renderNutrientsSortedByPct()
    }

    const $foodDetails = h.div({className: 'food-details'}, [
        h.h1({}, [
            foodGroupCircle(foodDetails),
            foodDetails.Long_Desc,
            h.output({}, [
                h.span({title: 'Overall percentage of nutrients covered by 100 grams of this food'}, [overallPct.toFixed(2) + nbsp + '%']),
                ', ',
                100 + nbsp + 'g'
            ]),
            h.a({
                href: 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.Long_Desc),
                title: 'See in Google Images'
            }, [icon('images')]),
            h.a({
                onclick: () => $findFoodsModal.open(),
                title: 'Find details of a different food'
            }, [icon('search')]),
            $sortByNameBtn,
            $sortByPctBtn,
            clear()
        ]),
        $nutrientList
    ])

    document.body.appendChild($foodDetails)

    function renderNutrientsSortedByName() {
        localStorage.setItem('nutrients_order', 'alpha')
        $sortByPctBtn.classList.remove('disabled')
        $sortByNameBtn.classList.add('disabled')
        $nutrientList.innerHTML = ''
        extendedRdis
            .sort((a, b) => {
                const nameA = a.display_name || a.NutrDesc
                const nameB = b.display_name || b.NutrDesc
                return nameA > nameB ? 1 : -1
            })
            .forEach(rdi => $nutrientList.appendChild(nutrientItem(rdi)))
    }

    function renderNutrientsSortedByPct() {
        localStorage.setItem('nutrients_order', 'pct')
        $sortByPctBtn.classList.add('disabled')
        $sortByNameBtn.classList.remove('disabled')
        $nutrientList.innerHTML = ''
        extendedRdis
            .sort((a, b) => a.pct > b.pct ? -1 : 1)
            .forEach(rdi => $nutrientList.appendChild(nutrientItem(rdi)))
    }
})
.catch(() => renderNoFoodScreen())

function renderNoFoodScreen() {
    document.body.appendChild(
        h.div({className: 'no-food'}, [
            h.p({}, [
                foodId
                    ? `No food exists with id ${foodId}. Try finding another food.`
                    : 'No food id was present in the URL. Look for some food.'
            ]),
            h.a({
                onclick: () => $findFoodsModal.open(),
                title: 'Find details of some food'
            }, [
                icon('search')
            ])
        ])
    )
}

function nutrientItem(rdi: ExtendedRdi) {
    let className = 'incomplete'
    if (rdi.pct >= 90) {
        className = 'complete'
    }
    if (rdi.max && rdi.Nutr_Val > rdi.max) {
        className = 'exceeding'
    }
    if (!rdi.max && rdi.pct >= 110) {
        className = 'possibly-exceeding'
    }

    return h.li({className}, [
        h.h2({}, [
            h.a({
                title: rdi.display_name ? rdi.NutrDesc : '',
                href: '/top-foods/index.html?nutrient-id=' + rdi.Nutr_No
            }, [rdi.display_name || rdi.NutrDesc])
        ]),
        h.span({className: 'progress-start', title: 'Percentage and amount of the nutrient covered by 100 grams of this food'}, [
            `${rdi.pct.toFixed(2)}${nbsp}%, ${rdi.Nutr_Val}${nbsp}${rdi.Units} (`,
            h.abbr({title: 'Tolerable Upper Intake Level'}, ['UL']),
            `: ${rdi.max ? `${rdi.max}\u2009${rdi.Units}` : `unkown`})`
        ]),
        h.span({className: 'progress-end', title: 'Reference Daily Intake'}, [
            rdi.value + nbsp + rdi.Units
        ]),
        h.progress({max: 100, value: rdi.pct})
    ])
}
