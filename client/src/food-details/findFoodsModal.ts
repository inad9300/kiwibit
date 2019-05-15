import {h} from '@soil/dom'
import {get} from '../shared/get'
import {icon} from '../shared/dom/icon'
import * as contract from '../../../shared/contract'
import {serverUrl} from '../shared/constants'
import {foodGroupCircle} from './foodGroupCircle'

export function findFoodsModal() {
    const $foodGroupSelect = h.select({
        oninput: () => {
            findFoodsByNameAndGroup($foodNameInput.value, $foodGroupSelect.value)
            if (!$foodNameInput.value) {
                $foodNameInput.focus()
            }
        }
    }, [
        h.option({value: '', selected: true}, ['All food groups'])
    ])

    get<contract.FoodGroup[]>(`${serverUrl}/foods/groups`)
        .then(cats => {
            cats.forEach(cat => {
                $foodGroupSelect.appendChild(
                    h.option({value: cat.FdGrp_Cd}, [cat.FdGrp_Desc])
                )
            })
        })

    const $foodNameInput = h.input({
        type: 'search',
        className: 's1',
        placeholder: 'Enter at least 3 characters, e.g. "lentils cooked"',
        oninput: () => findFoodsByNameAndGroup($foodNameInput.value, $foodGroupSelect.value)
    })

    const $resultList = h.ul()

    const $modal = h.div({className: 'hidden find-foods-modal'}, [
        h.div({className: 'h box'}, [
            $foodGroupSelect,
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

    function findFoodsByNameAndGroup(name: string, groupId: string) {
        if (name.length <= 2) {
            return
        }

        const urlName = 'name=' + name.replace(/\s/g, '%')
        const urlGroupId = groupId ? '&groupId=' + groupId : ''

        get<contract.FoundFood[]>(`${serverUrl}/foods/search?${urlName}${urlGroupId}`)
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
                        foodGroupCircle(food),
                        h.a({href: 'index.html?id=' + food.NDB_No}, [food.Long_Desc])
                    ])
                ))
            })
    }

    return Object.assign($modal, {open})
}
