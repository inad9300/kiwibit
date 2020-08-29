import type * as apiIndex from '../../../server/src/api'
import { hashCode } from './hashCode'

type Api = typeof apiIndex

type ThenArg<T> = T extends PromiseLike<infer U> ? U : never

export type ApiInput<Fn extends keyof Api> = Parameters<Api[Fn]>[0]

export type ApiOutput<Fn extends keyof Api> = ThenArg<ReturnType<Api[Fn]>>

export type AbortablePromise<T> = Promise<T> & { abort(): void }

const ongoingRequests: Record<string, Promise<any>> = {}

const cacheStr = sessionStorage.getItem('apiCache')
const cache: Record<string, any> = cacheStr ? JSON.parse(cacheStr) : {}
window.addEventListener('unload', () => sessionStorage.setItem('apiCache', JSON.stringify(cache)))

export function api<Fn extends keyof Api>(fn: Fn, payload: ApiInput<Fn>, options?: { cache?: boolean }) {
  const reqHash = fn + hashCode(payload)

  if (ongoingRequests[reqHash]) {
    return ongoingRequests[reqHash] as ReturnType<Api[Fn]> & { abort(): void }
  }

  if (options?.cache) {
    const data = cache[reqHash]
    if (data) {
      return Object.assign(Promise.resolve(data) as ReturnType<Api[Fn]>, {
        abort() {}
      })
    }
  }

  const aborter = new AbortController()

  const promise = fetch((DEBUG ? 'http://localhost:4000' : '') + '/api/' + fn, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: aborter.signal
  })
  .then(res => res.text())
  .then(body => body ? JSON.parse(body) : undefined)

  ongoingRequests[reqHash] = promise
  promise.finally(() => delete ongoingRequests[reqHash])

  if (options?.cache) {
    promise.then(data => cache[reqHash] = data)
  }

  return Object.assign(promise as ReturnType<Api[Fn]>, {
    abort: aborter.abort.bind(aborter)
  })
}
