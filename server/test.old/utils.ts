import fetch from 'node-fetch'
import * as Fetch from 'node-fetch'
import {Api} from '../../shared/Api'
import {In, Out} from '../../shared/Types'
import {client, Response} from '../src/client'

function timedFetch(url: string | Fetch.Request, req?: Fetch.RequestInit) {
    let t = process.hrtime()
    return fetch(url, req).then(res => {
        t = process.hrtime(t)
        ;(res as any).time = (t[0] * 1000 + t[1] / 1_000_000).toFixed(2) + 'ms'
        return res
    })
}

const request = client(timedFetch)

export function test<F extends keyof Api>(
    fn: F,
    args: In<Api[F]>,
    testFn: (res: Response<Out<Api[F]>>) => void
): Promise<Response<Out<Api[F]>>> {
    let res: Response<Out<Api[F]>>

    return request(fn, args)
        .then(_res => {
            res = _res
            testFn(res) // May throw an exception.
        })
        .then(() => {
            console.info(`✓ ${fn} – ${res.status} ${res.statusText} (${res.time})`)
            return res as any
        })
        .catch(err => {
            console.error(`✗ ${fn} – ${res.status} ${res.statusText} (${res.time}):`, err)
            process.exit(-1)
        })
}

export const random = {
    ascii: (size = 8) => {
        let str = Math.random().toString(36).substr(2)
        while (str.length < size) {
            str += Math.random().toString(36).substr(2)
        }
        return str.substr(0, size)
    }
}
