import {h} from '@soil/dom'
import {icon} from '../shared/dom/icon'

const page = h.div({className: 'page'}, [
    h.h1({className: 'main-title'}, ['Your profile']),
    h.form({}, [
        h.ul({className: 'field-list'}, [
            h.li({}, [
                h.label({htmlFor: 'field-age'}, ['Age']),
                h.input({id: 'field-age', type: 'number', min: '0', max: '150'})
            ]),
            h.li({}, [
                h.label({htmlFor: 'field-gender'}, ['Gender']),
                h.select({id: 'field-gender'}, [
                    h.option({value: 'M'}, ['Male']),
                    h.option({value: 'F'}, ['Female'])
                ])
            ])
        ]),
        h.hr(),
        h.button({onclick: () => save()}, [icon('save'), 'Save'])
    ])
])

function save() {
    // TODO
    console.log('Saving...')
}

document.body.appendChild(page)
