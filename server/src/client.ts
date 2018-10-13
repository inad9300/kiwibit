import {Api} from '../../shared/Api'
import {In, Out} from '../../shared/Types'

export type Response<B> = {
    readonly status: number
    readonly statusText: string
    readonly headers: BasicFetchHeaders
    readonly body: B
    readonly time?: string
}

type BasicFetchRequestInit = {
    method?: string
    headers?: {[header: string]: string}
    body?: any
}

type BasicFetchResponse = {
    readonly status: number
    readonly statusText: string
    readonly headers: BasicFetchHeaders
    readonly body: any
    readonly ok: boolean;
    json(): Promise<any>
}

interface BasicFetchHeaders {
    append(name: string, value: string): void;
    delete(name: string): void;
    get(name: string): string | null;
    has(name: string): boolean;
    set(name: string, value: string): void;
    forEach(callback: (value: string, name: string) => void): void;
}

type BasicFetch = (url: string, requestInit?: BasicFetchRequestInit) => Promise<BasicFetchResponse>

/**
 * Factory function for type-safe API consumers.
 */
export function client(fetchFn: BasicFetch) {
    return function request<F extends keyof Api>(
        fn: F,
        args: In<Api[F]>,
        headers: BasicFetchRequestInit['headers'] = {}
    ): Promise<Response<Out<Api[F]>>> {
        let res: BasicFetchResponse

        return fetchFn(`http://localhost:4000/api/${fn}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                ...headers
            },
            body: JSON.stringify(args)
        })
        .then(_res => {
            res = _res
            return res.json()
        })
        .then(body => {
            const ret = {
                status: res.status,
                statusText: res.statusText,
                headers: res.headers,
                body,
                time: (res as any).time
            }
            return res.ok
                ? Promise.resolve(ret)
                : Promise.reject(ret)
        })
    }
}
