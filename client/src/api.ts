import {Api} from '../../server/src/Api'
import {config} from '../../shared/config'

const headers = {'Content-Type': 'application/json; charset=utf-8'}

export function api<Fn extends keyof Api>(fn: Fn, payload: Parameters<Api[Fn]>[0]): Promise<ReturnType<Api[Fn]>> {
    return fetch(config.server.addr + fn, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(body => body ? JSON.parse(body) : undefined)
}
