import {h} from '@soil/dom'
import * as db from '../../../shared/db/model'

export function foodGroupCircle(foodGroup: Partial<db.fd_group>) {
    return h.span({
        title: foodGroup.FdGrp_Desc,
        className: 'food-group-circle',
        style: {
            backgroundColor: foodGroup.color
        }
    })
}
