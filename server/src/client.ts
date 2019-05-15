import fetch from 'node-fetch'
import {Api} from './Api'
import {config} from '../../shared/config'

// TODO Rethink architecture: run against the server or the functions directly?

export const timing: [string, number][] = []

export const client: Api = new Proxy({}, {
    get: (_obj, fn: string) => (payload: any) => {
        let t = process.hrtime()
        return fetch(config.server.addr + fn, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: payload ? JSON.stringify(payload) : undefined
        })
        .then(res => {
            t = process.hrtime(t)
            timing.push([fn, t[0] * 1000 + t[1] / 1_000_000])
            return res.text()
        })
        .then(body => body ? JSON.parse(body) : undefined)
    }
}) as Api
