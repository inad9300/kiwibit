import {client} from '../client'
import {ok} from 'assert'

export default [
    client.registerUser({name: ''}).then(user => {
        ok(user === user)
    })
]
