import {client} from '../client'
import {ok} from 'assert'

export default {
    'fetch current user': async () => {
        const user = await client.getCurrentUser({token: ''})
        ok(user !== undefined)
        ok(user.name !== undefined)
        ok(user.name.length > 3)
    }
}
