import {h} from '@soil/dom'
import {get} from '../shared/utils/get'
import {add} from '../shared/utils/add'
import {pct} from '../shared/utils/pct'
import {unit} from '../shared/utils/unit'
import {icon} from '../shared/utils/icon'
import {clear} from '../shared/utils/clear'
import * as contract from '../../../shared/contract'

const urlParams = new URLSearchParams(location.search.substr(1))
const foodId = urlParams.get('id')
if (!foodId) {
    throw new Error('Food id missing in the URL.')
}

Promise.all([
    get<contract.Rdi[]>(`http://localhost:4000/api/rdis?age=20&gender=M`),
    get<contract.FoodDetails>(`http://localhost:4000/api/foods/${foodId}`)
]).then(([rdis, foodDetails]) => {
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

    document.body.appendChild(h.div({className: 'food-details'}, [
        h.h1({}, [
            foodDetails.Long_Desc,
            h.output({}, [
                unit(100, 'g'),
                ', ',
                Object.assign(
                    unit(overallPct.toFixed(2), '%'),
                    {title: 'Overall percentage of nutrients covered by this food.'}
                )
            ]),
            h.a({
                href: 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent(foodDetails.Long_Desc),
                title: 'See in Google Images.'
            }, [icon('images')]),
            h.a({
                onclick: () => openFindFoodsModal(),
                title: 'Find details of a different food.'
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
    ]))
})

const findFoodsModalInput = h.input({
    type: 'search',
    className: 's1',
    oninput: evt => findFoods((evt.target as h.Input).value)}
)
const findFoodsModalResultList = h.ul()

const findFoodsModal = h.div({className: 'hidden find-food-modal'}, [
    h.div({className: 'h box'}, [
        findFoodsModalInput,
        h.button({onclick: closeFindFoodsModal}, [icon('times')]),
    ]),
    findFoodsModalResultList
])

document.body.appendChild(findFoodsModal)

function openFindFoodsModal() {
    findFoodsModal.classList.remove('hidden')
    findFoodsModalInput.focus()
}

function closeFindFoodsModal() {
    findFoodsModal.classList.add('hidden')
}

function findFoods(name: string) {
    if (name.length <= 2) {
        return
    }

    get<contract.FoundFood[]>(`http://localhost:4000/api/foods/search?name=${name.replace(/\s/g, '%')}`)
        .then(foods => {
            findFoodsModalResultList.innerHTML = ''

            if (foods.length === 0) {
                findFoodsModalResultList.appendChild(
                    h.li({className: 'no-results'}, ['No results.'])
                )
                return
            }

            foods.forEach(food => findFoodsModalResultList.appendChild(
                h.li({}, [
                    // TODO Use `food.FdGrp_Desc`.
                    h.a({href: 'index.html?id=' + food.NDB_No}, [food.Long_Desc])
                ])
            ))
        })
}
