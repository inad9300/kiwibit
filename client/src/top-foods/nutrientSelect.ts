import {h} from '@soil/dom'
import {get} from '../shared/http/get'
import {serverUrl} from '../shared/constants'
import {Nutrient} from '../../../shared/contract'
import {getUrlParams} from '../shared/utils/getUrlParams'

const urlParams = getUrlParams()
const nutrientId = urlParams.get('nutrient-id')

export function nutrientSelect(args: {onChange: (nutrientId: string) => void, onLoad: (nutrient: Nutrient) => void}) {
    const $select = h.select({
        onchange: () => args.onChange($select.value)
    }, [
        h.option({disabled: true, selected: true}, ['Select a nutrient...'])
    ])

    get<Nutrient[]>(`${serverUrl}/nutrients`).then(nutrients => {
        nutrients.forEach(n => $select.appendChild(
            h.option({
                value: n.Nutr_No,
                title: n.display_name ? n.NutrDesc: ''
            }, [
                `${n.display_name || n.NutrDesc} (${n.Units})`
            ])
        ))

        if (nutrientId) {
            const nutrient = nutrients.find(n => n.Nutr_No === nutrientId)
            if (nutrient !== undefined) {
                $select.value = nutrientId
                args.onLoad(nutrient)
            }
        }
    })

    return $select
}
