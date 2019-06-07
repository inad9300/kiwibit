import {h} from '@soil/dom'
import {get} from '../../src/shared/get'
import {header} from '../header/header'

type BasicFood = any

const selectedFoods: BasicFood[] = []

const foodSelectPlaceholderOption = h.option({disabled: true}, ['Results will appear here (up to 100)'])

const foodSelect = h.select({multiple: true}, [
    foodSelectPlaceholderOption
])

const foodSelector = h.div({className: 'food-selector'}, [
    h.div({className: 'top-controls'}, [
        h.input({
            type: 'search',
            placeholder: 'Find foods (at least 3 characters)',
            oninput: evt => {
                const text = (evt.target as h.Input).value
                if (text.length <= 2) {
                    foodSelect.innerHTML = ''
                    foodSelect.appendChild(foodSelectPlaceholderOption)
                    return
                }

                get('/find-foods/' + text)
                    .then((foods: BasicFood[]) => {
                        foodSelect.innerHTML = ''
                        foods
                            .map(f => h.option({value: f.ndb_no}, [f.long_desc]))
                            .forEach(opt => foodSelect.appendChild(opt))
                    })
            }
        }),
        h.button({
            onclick: () => {
                Array
                    .from(foodSelect.options)
                    .filter(opt => opt.selected)
                    .forEach(opt => {
                        for (let i = 0; i < selectedFoods.length; ++i) {
                            if (selectedFoods[i].ndb_no === opt.value) {
                                return;
                            }
                        }

                        selectedFoods.push({
                            ndb_no: opt.value,
                            long_desc: opt.textContent!
                        })
                        selectedFoodList.appendChild(h.li({}, [opt.textContent!]))
                    })
            }
        }, ['Add']),
    ]),
    foodSelect
])

const selectedFoodList = h.ul()

document.body.appendChild(header())
document.body.appendChild(h.div({className: 'container padded'}, [
    foodSelector,
    selectedFoodList
]))
