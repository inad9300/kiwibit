import {ssql} from '../sql'
import * as schema from '../schema'

type WithToken = {
    token: string
}

export function getCurrentUser(_input: WithToken) {
    let uno = 1
    let dos = 2
    return ssql<schema.users>`select * from users where id = ${uno + dos}`.then(res => res.rows[0])
}
