import {client} from '../client'
import {ok} from 'assert'

export default [
    client.getCurrentUser({token: ''}).then(user => {
        ok(user !== undefined)
        ok(user.name !== undefined)
        ok(user.name.length > 3)
    })
]
