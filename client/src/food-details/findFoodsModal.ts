import {h} from '@soil/dom'
import {get} from '../shared/http/get'
import {icon} from '../shared/dom/icon'
import * as contract from '../../../shared/contract'
import {serverUrl} from '../shared/constants'

export function findFoodsModal() {
    const $foodCategorySelect = h.select({
        oninput: () => {
            findFoodsByNameAndCategory($foodNameInput.value, $foodCategorySelect.value)
            if (!$foodNameInput.value) {
                $foodNameInput.focus()
            }
        }
    }, [
        h.option({value: '', selected: true}, ['All food categories'])
    ])

    get<contract.FoodCategory[]>(`${serverUrl}/foods/categories`, {cache: true})
        .then(cats => {
            cats.forEach(cat => {
                $foodCategorySelect.appendChild(
                    h.option({value: cat.FdGrp_Cd}, [cat.FdGrp_Desc])
                )
            })
        })

    const $foodNameInput = h.input({
        type: 'search',
        className: 's1',
        placeholder: 'Enter at least 3 characters, e.g. "lentils cooked"',
        oninput: () => findFoodsByNameAndCategory($foodNameInput.value, $foodCategorySelect.value)
    })

    const $resultList = h.ul()

    const $modal = h.div({className: 'hidden find-foods-modal'}, [
        h.div({className: 'h box'}, [
            $foodCategorySelect,
            $foodNameInput,
            h.button({onclick: close, title: 'Close (Esc)'}, [icon('times')]),
        ]),
        $resultList
    ])

    function handleEsc(evt: KeyboardEvent) {
        if (evt.key === 'Escape') {
            close()
        }
    }

    function open() {
        $modal.classList.remove('hidden')
        $foodNameInput.focus()
        document.addEventListener('keydown', handleEsc)
    }

    function close() {
        $modal.classList.add('hidden')
        $foodNameInput.value = ''
        document.removeEventListener('keydown', handleEsc)
    }

    function findFoodsByNameAndCategory(name: string, categoryId: string) {
        if (name.length <= 2) {
            return
        }

        const urlName = 'name=' + name.replace(/\s/g, '%')
        const urlCategoryId = categoryId ? '&categoryId=' + categoryId : ''

        get<contract.FoundFood[]>(`${serverUrl}/foods/search?${urlName}${urlCategoryId}`, {cache: true})
            .then(foods => {
                $resultList.innerHTML = ''

                if (foods.length === 0) {
                    $resultList.appendChild(
                        h.li({className: 'no-results'}, ['No results.'])
                    )
                    return
                }

                foods.forEach(food => $resultList.appendChild(
                    h.li({}, [
                        h.span({
                            title: food.FdGrp_Desc,
                            className: 'food-group-circle',
                            style: {backgroundColor: food.color}
                        }),
                        h.a({href: 'index.html?id=' + food.NDB_No}, [food.Long_Desc])
                    ])
                ))
            })
    }

    return Object.assign($modal, {open})
}
