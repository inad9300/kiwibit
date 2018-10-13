import {client} from '../../server/src/client'

export const api = client(fetch)
