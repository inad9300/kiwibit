import { getCurrentUser } from '.'
import { ok } from 'assert'

export default {
  'fetch current user': async () => {
    const user = await getCurrentUser({ token: '' })
    ok(user !== undefined)
    ok(user.name !== undefined)
    ok(user.name.length > 3)
  }
}
