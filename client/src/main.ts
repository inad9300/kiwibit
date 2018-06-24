import {h} from '@soil/dom'

const nbsp = '\u00A0'

const foodSelect = h.select({
    onchange: () => {
        fetch(foodSelect.value)
            .then(res => res.json())
            .then(fillFoodList)
    }
}, [
    h.option({disabled: true, selected: true}, ['Food category']),
    h.option({value: "/beverages"}, ['Beverages']),
    h.option({value: "/breakfast-cereals"}, ['Breakfast cereals']),
    h.option({value: "/fats-and-oils"}, ['Fats and oils']),
    h.option({value: "/fruits-and-juices"}, ['Fruits and juices']),
    h.option({value: "/grains"}, ['Grains']),
    h.option({value: "/legumes"}, ['Legumes']),
    h.option({value: "/nuts-and-seeds"}, ['Nuts and seeds']),
    h.option({value: "/soupes-and-sauces"}, ['Soupes and sauces']),
    h.option({value: "/spices-and-herbs"}, ['Spices and herbs']),
    h.option({value: "/vegetables"}, ['Vegetables']),
])

interface BasicFood {
    ndb_no: string
    long_desc: string
}

interface FoodNutrition {
    nutrdesc: string
    nutr_val: number
    units: string
    add_nutr_mark: boolean | '' // FIXME (Server problem.)
    max: number
    min: number
}

interface FoodSource {
    journal: string
    title: string
    authors: string
    year: string
}

interface FoodDetails {
    fdgrp_desc: string
    long_desc: string
    comname?: string
    refuse?: number
    ref_desc?: string
    sciname?: string
    manufacname?: string
    nutrition: FoodNutrition[]
    sources: FoodSource[]
}

const foodList = h.ul({className: 'food-list'})

function fillFoodList(data: BasicFood[]) {
    foodList.innerHTML = ''

    data
        .map(item => h.li({}, [
            h.span({
                tabIndex: 0,
                className: 'clickable',
                onclick: () => showFoodDetails(item.ndb_no),
                onkeydown: evt => {
                    if (evt.key === 'Enter') {
                        showFoodDetails(item.ndb_no)
                    }
                }
            }, [item.long_desc])
        ]))
        .forEach(li => foodList.appendChild(li))
}

function showFoodDetails(id: string) {
    fetch('/foods/' + id)
        .then(res => res.json())
        .then((data: FoodDetails) => {
            const details = h.dl({}, [
                h.dt({}, ['Food group']),
                h.dd({}, [data.fdgrp_desc]),
                h.dt({}, ['Common name']),
                h.dd({}, [data.long_desc + (data.comname ? ` (${data.comname})` : '')]),
                h.dt({}, ['Scientific name']),
                h.dd({}, [data.sciname || nbsp]),
                h.dt({}, ['Inedible']),
                h.dd({}, [(data.refuse || 0) + '%']),
                h.dt({}, ['Inedible parts']),
                h.dd({}, [data.ref_desc || nbsp]),
                h.dt({}, ['Manufacturer']),
                h.dd({}, [data.manufacname || nbsp])
            ])

            const nutrition = h.table({}, [
                h.thead({}, [
                    h.tr({}, [
                        h.th({}, ['Nutrient']),
                        h.th({}, ['Value']),
                        h.th({}, ['Minimum']),
                        h.th({}, ['Maximum']),
                        h.th({}, [
                            h.abbr({title: 'Added for fortification or enrichment'}, ['Added'])
                        ])
                    ]),
                ]),
                h.tbody({}, data.nutrition.map(nut => h.tr({}, [
                    h.td({}, [nut.nutrdesc]),
                    h.td({}, [nut.nutr_val + ' ' + nut.units]),
                    h.td({}, [nut.min + ' ' + nut.units]),
                    h.td({}, [nut.max + ' ' + nut.units]),
                    h.td({}, [nut.add_nutr_mark ? 'Yes' : 'No'])
                ])))
            ])

            const sources = h.table({}, [
                h.thead({}, [
                        h.tr({}, [
                        h.th({}, ['Title']),
                        h.th({}, ['Authors']),
                        h.th({}, ['Journal']),
                        h.th({}, ['Year'])
                    ]),
                ]),
                h.tbody({}, data.sources.map(src => h.tr({}, [
                    h.td({}, [src.title]),
                    h.td({}, [src.authors]),
                    h.td({}, [src.journal]),
                    h.td({}, [src.year])
                ])))
            ])

            const modal = h.div({className: 'overlay', onclick: () => removeModal()}, [
                h.div({className: 'padded modal', onclick: evt => evt.stopPropagation()}, [
                    h.h2({}, ['Details']),
                    details,
                    h.div({className: 'cleared'}),
                    h.h2({}, ['Nutrition facts']),
                    nutrition,
                    h.h2({}, ['Sources']),
                    sources
                ])
            ])

            document.body.appendChild(modal)

            window.addEventListener('keydown', handleEscape)

            function handleEscape(evt: KeyboardEvent) {
                if (evt.key === 'Escape') {
                    removeModal()
                }
            }

            function removeModal() {
                modal.remove()
                window.removeEventListener('keydown', handleEscape)
            }
        })
}

document.body.appendChild(foodSelect)
document.body.appendChild(foodList)

foodSelect.focus()
