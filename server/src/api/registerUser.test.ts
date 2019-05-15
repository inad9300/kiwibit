import {client} from '../client'
import {ok} from 'assert'

export default {
    'register user': async () => {
        const user = await client.registerUser({name: ''})
        ok(user === user)
    }
}
