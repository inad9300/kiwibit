import './header.scss';

import {h} from '@soil/dom'

export function header() {
    return h.nav({className: 'header'}, [
        h.h1({}, [
            h.a({href: '/'}, ['Kiwibit'])
        ]),
        h.ul({}, [
            h.li({}, [
                h.a({href: 'food-details.html'}, ['Food details, by category'])
            ]),
            h.li({}, [
                h.a({href: 'top-foods.html'}, ['Top foods, by nutrient'])
            ])
        ])
    ])
}
