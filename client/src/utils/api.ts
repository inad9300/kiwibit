import type * as apiIndex from '../../../server/src/api'
import { hashCode } from './hashCode'

type Api = typeof apiIndex

type ThenArg<T> = T extends PromiseLike<infer U> ? U : never

export type ApiInput<Fn extends keyof Api> = Parameters<Api[Fn]>[0]

export type ApiOutput<Fn extends keyof Api> = ThenArg<ReturnType<Api[Fn]>>

export type AbortablePromise<T> = Promise<T> & { abort(): void }

const cacheStr = sessionStorage.getItem('apiCache')
const cache: Record<string, Record<number, any>> = cacheStr ? JSON.parse(cacheStr) : {}
window.addEventListener('unload', () => sessionStorage.setItem('apiCache', JSON.stringify(cache)))

export function api<Fn extends keyof Api>(fn: Fn, payload: ApiInput<Fn>, options?: { cache?: boolean }) {
  if (options?.cache && cache[fn]) {
    const data = cache[fn][hashCode(payload)]
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

  if (options?.cache) {
    cache[fn] = cache[fn] || {}
    promise.then(data => cache[fn][hashCode(payload)] = data)
  }

  return Object.assign(promise as ReturnType<Api[Fn]>, {
    abort: aborter.abort.bind(aborter)
  })
}
