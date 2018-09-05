import {h} from '@soil/dom'
import {get} from '../shared/http/get'
import {add} from '../shared/utils/add'
import {pct} from '../shared/utils/pct'
import {getUrlParams} from '../shared/utils/getUrlParams'
import {title} from '../shared/dom/title'
import {unit} from '../shared/dom/unit'
import {icon} from '../shared/dom/icon'
import {clear} from '../shared/dom/clear'
import * as contract from '../../../shared/contract'
import {serverUrl} from '../shared/constants'
import {findFoodsModal} from './findFoodsModal'

type ExtendedRdi = contract.Rdi & {pct: number, Nutr_Val: number}

const urlParams = getUrlParams()
const foodId = urlParams.get('id')
if (!foodId) {
    // TODO Communicate to the user.
    throw new Error('Food id missing in the URL.')
}

Promise.all([
    get<contract.Rdi[]>(`${serverUrl}/rdis?age=20&gender=M`),
    get<contract.FoodDetails>(`${serverUrl}/foods/${foodId}`)
])
.then(([rdis, foodDetails]) => {
    title(foodDetails.Long_Desc)

    const extendedRdis = rdis
        .map(rdi => {
            const nutr = foodDetails.nutrients.find(nutr => nutr.NutrDesc === rdi.NutrDesc)
            return !nutr ? undefined : {
                ...rdi,
                pct: pct(nutr.Nutr_Val, rdi.value),
                Nutr_Val: nutr.Nutr_Val
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
            foodDetails.Long_Desc,
            h.output({}, [
                unit(100, 'g'),
                ', ',
                Object.assign(
                    unit(overallPct.toFixed(2), '%'),
                    {title: 'Overall percentage of nutrients covered by 100 grams of this food'}
                )
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
            .sort((a, b) => a.NutrDesc > b.NutrDesc ? 1 : -1)
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

const $findFoodsModal = findFoodsModal()
document.body.appendChild($findFoodsModal)

function nutrientItem(rdi: ExtendedRdi) {
    return h.li({}, [
        h.h2({}, [
            rdi.NutrDesc,
            // TODO Take into account the tolerable upper intake level.
            h.output({className: rdi.pct > 300 ? 'high' : ''}, [
                unit(rdi.Nutr_Val, rdi.Units),
                ', ',
                unit(rdi.pct.toFixed(2), '%')
            ])
        ]),
        h.progress({max: 100, value: rdi.pct})
    ])
}
