import {registerUser} from '.'
import {ok} from 'assert'

export default {
    'register user': async () => {
        const user = await registerUser({name: ''})
        ok(user === user)
    }
}
