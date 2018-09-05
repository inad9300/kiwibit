import {h} from '@soil/dom'
import {get} from '../shared/http/get'
import {add} from '../shared/utils/add'
import {pct} from '../shared/utils/pct'
import {getUrlParams} from '../shared/utils/getUrlParams'
import {unit} from '../shared/dom/unit'
import {icon} from '../shared/dom/icon'
import {clear} from '../shared/dom/clear'
import * as contract from '../../../shared/contract'
import {server_url} from '../shared/constants'
import {findFoodsModal} from './findFoodsModal'

const $findFoodsModal = findFoodsModal()

const urlParams = getUrlParams()
const foodId = urlParams.get('id')
if (!foodId) {
    // TODO Communicate to the user.
    throw new Error('Food id missing in the URL.')
}

Promise.all([
    get<contract.Rdi[]>(`${server_url}/rdis?age=20&gender=M`),
    get<contract.FoodDetails>(`${server_url}/foods/${foodId}`)
])
.then(([rdis, foodDetails]) => {
    const extendedRdis = rdis
        .map(rdi => {
            const nutr = foodDetails.nutrients.find(nutr => nutr.NutrDesc === rdi.NutrDesc)
            return !nutr ? undefined : {
                ...rdi,
                pct: pct(nutr.Nutr_Val, rdi.value),
                Nutr_Val: nutr.Nutr_Val
            }
        })
        .filter(pct => pct !== undefined) as (contract.Rdi & {pct: number, Nutr_Val: number})[]

    const overallPct = pct(
        extendedRdis.map(rdi => Math.min(rdi.pct, 100)).reduce(add, 0),
        100 * extendedRdis.length
    )

    const $foodDetails = h.div({className: 'food-details'}, [
        h.h1({}, [
            foodDetails.Long_Desc,
            h.output({}, [
                unit(100, 'g'),
                ', ',
                Object.assign(
                    unit(overallPct.toFixed(2), '%'),
                    {title: 'Overall percentage of nutrients covered by this food'}
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
            clear()
        ]),
        h.ul({}, extendedRdis.map(rdi => h.li({}, [
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
        ])))
    ])

    document.body.appendChild($foodDetails)
})

document.body.appendChild($findFoodsModal)
