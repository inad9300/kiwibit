import fetch from 'node-fetch'
import {Api} from './Api'

const serverAddr = 'http://localhost:4000/api/'

export const timing: [string, number][] = []

export const client: Api = new Proxy({}, {
    get: (_obj, fn: string) => (payload: any) => {
        let t = process.hrtime()
        return fetch(serverAddr + fn, {
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            body: payload ? JSON.stringify(payload) : undefined
        })
        .then(res => {
            t = process.hrtime(t)
            timing.push([fn, t[0] * 1000 + t[1] / 1_000_000])
            return res
                .text()
                .then(body => body ? JSON.parse(body) : undefined)
        })
    }
}) as Api
