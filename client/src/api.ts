import {Api, ApiPayload} from '../../server/src/Api'
import {config} from '../../shared/config'

export const api: Api = {
    getCurrentUser: endpoint('getCurrentUser'),
    registerUser: endpoint('registerUser')
}

const headers = {'Content-Type': 'application/json; charset=utf-8'}

function endpoint(fn: keyof Api) {
    const url = config.server.addr + fn

    return (payload?: ApiPayload) => fetch(url, {
        method: 'POST',
        headers,
        body: payload ? JSON.stringify(payload) : undefined
    })
    .then(res => res.text())
    .then(body => body ? JSON.parse(body) : undefined)
}
