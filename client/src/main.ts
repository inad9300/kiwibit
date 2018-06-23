import {h} from '@soil/dom'

const baseUri = 'http://localhost:3000'

const fruitsSelect = h.select({
    onchange: () => {
        fetch(baseUri + fruitsSelect.value)
            .then(res => res.json())
            .then(fillTable)
    }
}, [
    h.option({disabled: true, selected: true}, ['Food category']),
    h.option({value: "/spices-and-herbs"}, ['Spices and herbs']),
    h.option({value: "/fats-and-oils"}, ['Fats and oils']),
    h.option({value: "/soupes-and-sauces"}, ['Soupes and sauces']),
    h.option({value: "/breakfast-cereals"}, ['Breakfast cereals']),
    h.option({value: "/fruits-and-juices"}, ['Fruits and juices']),
    h.option({value: "/vegetables"}, ['Vegetables']),
    h.option({value: "/nuts-and-seeds"}, ['Nuts and seeds']),
    h.option({value: "/beverages"}, ['Beverages']),
    h.option({value: "/legumes"}, ['Legumes']),
    h.option({value: "/grains"}, ['Grains'])
])

function fillTable(data: any[]) {
    document.querySelector('table')!.innerHTML = data
        .map(item => `<tr><td>${item.long_desc}</td></tr>`)
        .join('')
}

document.body.appendChild(fruitsSelect)
document.body.appendChild(h.table())
