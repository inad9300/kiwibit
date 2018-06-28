import {h} from '@soil/dom'

const pages = h.ul({}, [
    h.li({}, [
        h.a({className: 'button', href: 'food-details.html'}, ['Food details, by category'])
    ]),
    h.li({}, [
        h.a({className: 'button', href: 'top-foods.html'}, ['Top foods, by nutrient'])
    ])
])

document.body.appendChild(pages)
